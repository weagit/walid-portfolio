"use client";

/**
 * InfiniteMenu — 3D sphere of orbiting project tiles. Drag to spin, the
 * sphere snaps to a "front" tile, and clicking the action arrow triggers
 * the project's onSelect callback (we open the existing ProjectModal).
 *
 * Adapted from reactbits.dev/components/infinite-menu (David Haz).
 * Ported to TypeScript and rewired:
 *   - items expose `onSelect` instead of a string link
 *   - overlay text uses our display + serif fonts
 *   - mid-tier perf: DPR capped at 1.5
 *
 * Uses gl-matrix for math + raw WebGL2 for rendering. No three.js.
 */

import { useEffect, useRef, useState } from "react";
import { mat4, quat, vec2, vec3 } from "gl-matrix";

export type InfiniteMenuItem = {
  /** Project title (also drawn on the tile) */
  title: string;
  /** Short subtitle / tagline shown in the side panel */
  description: string;
  /** Click handler — opens the project modal */
  onSelect: () => void;
  /** Optional screenshot path. If absent, a synthetic tile is rendered. */
  image?: string;
  /** Chapter index drawn at the top of the tile, e.g. "01" */
  index?: string;
  /** Mood accent color in hex */
  accent?: string;
  /** Cropping bias when fitting a non-square image into the tile */
  tileFocus?: "top" | "center" | "bottom";
  /** Synthetic tile style when no image is provided */
  fallback?: "architecture" | "arena" | "fresh";
};

const discVertShaderSource = `#version 300 es

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uCameraPosition;
uniform vec4 uRotationAxisVelocity;

in vec3 aModelPosition;
in vec3 aModelNormal;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;

out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;

#define PI 3.141593

void main() {
    vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);

    vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;
    float radius = length(centerPos.xyz);

    if (gl_VertexID > 0) {
        vec3 rotationAxis = uRotationAxisVelocity.xyz;
        float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);
        vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
        vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
        float strength = dot(stretchDir, relativeVertexPos);
        float invAbsStrength = min(0., abs(strength) - 1.);
        strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);
        worldPosition.xyz += stretchDir * strength;
    }

    worldPosition.xyz = radius * normalize(worldPosition.xyz);

    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;
    vUvs = aModelUvs;
    vInstanceId = gl_InstanceID;
}
`;

const discFragShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;

out vec4 outColor;

in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;

void main() {
    int itemIndex = vInstanceId % uItemCount;
    int cellsPerRow = uAtlasSize;
    int cellX = itemIndex % cellsPerRow;
    int cellY = itemIndex / cellsPerRow;
    vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
    vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;

    ivec2 texSize = textureSize(uTex, 0);
    float imageAspect = float(texSize.x) / float(texSize.y);
    float containerAspect = 1.0;

    float scale = max(imageAspect / containerAspect, containerAspect / imageAspect);

    vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
    st = (st - 0.5) * scale + 0.5;
    st = clamp(st, 0.0, 1.0);
    st = st * cellSize + cellOffset;

    outColor = texture(uTex, st);
    outColor.a *= vAlpha;
}
`;

/**
 * Render one project tile into a 2D canvas region. Handles both real
 * screenshot tiles (cover-fit with focus bias + bottom title overlay) and
 * synthetic fallback tiles (mood gradient + glyph + title) for backend-
 * only projects with no UI to show.
 */
function drawTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  item: InfiniteMenuItem,
  img: HTMLImageElement | null
) {
  const accent = item.accent || "#D4D4D4";

  // Clip to the cell so nothing bleeds into neighbours
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, size, size);
  ctx.clip();

  if (img) {
    // Cover-fit with focus bias
    const ar = img.width / img.height;
    let dw = size,
      dh = size,
      dx = x,
      dy = y;
    if (ar > 1) {
      dh = size;
      dw = size * ar;
      dx = x - (dw - size) / 2;
    } else {
      dw = size;
      dh = size / ar;
      // Vertical bias: top → keep top, bottom → keep bottom
      const overflow = dh - size;
      const focus = item.tileFocus ?? "center";
      if (focus === "top") dy = y;
      else if (focus === "bottom") dy = y - overflow;
      else dy = y - overflow / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  } else {
    // Synthetic tile background — radial mood + dark base
    const grd = ctx.createRadialGradient(
      x + size * 0.5,
      y + size * 0.4,
      size * 0.05,
      x + size * 0.5,
      y + size * 0.5,
      size * 0.7
    );
    grd.addColorStop(0, hexWithAlpha(accent, 0.35));
    grd.addColorStop(1, "#0A0A0A");
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, size, size);

    // Architecture-style glyph: two service blocks connected by a line
    if (item.fallback === "architecture") {
      drawArchGlyph(ctx, x, y, size, accent);
    } else if (item.fallback === "arena") {
      drawArenaGlyph(ctx, x, y, size, accent);
    } else if (item.fallback === "fresh") {
      drawFreshGlyph(ctx, x, y, size, accent);
    }
  }

  // Subtle vignette so the image still pops on the sphere — but no text:
  // the project name lives in the side panel.
  const vignette = ctx.createRadialGradient(
    x + size / 2,
    y + size / 2,
    size * 0.3,
    x + size / 2,
    y + size / 2,
    size * 0.7
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = vignette;
  ctx.fillRect(x, y, size, size);

  ctx.restore();
}

function hexWithAlpha(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function drawArchGlyph(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  accent: string
) {
  // Two service blocks with REST arrow + DB cylinder underneath
  const cx = x + size / 2;
  const cy = y + size * 0.42;
  const w = size * 0.22;
  const h = size * 0.13;
  const gap = size * 0.16;

  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.fillStyle = "rgba(0,0,0,0.4)";

  // Service A
  ctx.fillRect(cx - gap - w, cy - h / 2, w, h);
  ctx.strokeRect(cx - gap - w, cy - h / 2, w, h);
  // Service B
  ctx.fillRect(cx + gap, cy - h / 2, w, h);
  ctx.strokeRect(cx + gap, cy - h / 2, w, h);

  // Arrow between
  ctx.beginPath();
  ctx.moveTo(cx - gap, cy);
  ctx.lineTo(cx + gap, cy);
  ctx.stroke();
  // Arrow head
  ctx.beginPath();
  ctx.moveTo(cx + gap, cy);
  ctx.lineTo(cx + gap - 8, cy - 6);
  ctx.lineTo(cx + gap - 8, cy + 6);
  ctx.closePath();
  ctx.fillStyle = accent;
  ctx.fill();

  // DB cylinder
  const dbY = cy + h * 1.6;
  const dbW = w * 1.2;
  ctx.strokeStyle = accent;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(cx, dbY, dbW, h * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - dbW, dbY);
  ctx.lineTo(cx - dbW, dbY + h * 0.7);
  ctx.moveTo(cx + dbW, dbY);
  ctx.lineTo(cx + dbW, dbY + h * 0.7);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, dbY + h * 0.7, dbW, h * 0.3, 0, 0, Math.PI);
  ctx.stroke();

  // Service port labels
  ctx.fillStyle = accent;
  ctx.font = `${Math.round(size * 0.028)}px ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.fillText("8080", cx - gap - w / 2, cy + h);
  ctx.fillText("8081", cx + gap + w / 2, cy + h);
}

function drawArenaGlyph(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  accent: string
) {
  // Half-court arc + center circle
  const cx = x + size / 2;
  const cy = y + size * 0.42;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy + size * 0.16, size * 0.28, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
}

function drawFreshGlyph(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  accent: string
) {
  // Soft circle leaf-like silhouette
  const cx = x + size / 2;
  const cy = y + size * 0.42;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(cx, cy, size * 0.18, size * 0.22, Math.PI / 6, 0, Math.PI * 2);
  ctx.stroke();
}

class Face {
  a: number;
  b: number;
  c: number;
  constructor(a: number, b: number, c: number) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

class Vertex {
  position: vec3;
  normal: vec3;
  uv: vec2;
  constructor(x: number, y: number, z: number) {
    this.position = vec3.fromValues(x, y, z);
    this.normal = vec3.create();
    this.uv = vec2.create();
  }
}

class Geometry {
  vertices: Vertex[] = [];
  faces: Face[] = [];

  addVertex(...args: number[]) {
    for (let i = 0; i < args.length; i += 3) {
      this.vertices.push(new Vertex(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  addFace(...args: number[]) {
    for (let i = 0; i < args.length; i += 3) {
      this.faces.push(new Face(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  get lastVertex() {
    return this.vertices[this.vertices.length - 1];
  }

  subdivide(divisions = 1) {
    const midPointCache: Record<string, number> = {};
    let f = this.faces;
    for (let div = 0; div < divisions; ++div) {
      const newFaces = new Array<Face>(f.length * 4);
      f.forEach((face, ndx) => {
        const mAB = this.getMidPoint(face.a, face.b, midPointCache);
        const mBC = this.getMidPoint(face.b, face.c, midPointCache);
        const mCA = this.getMidPoint(face.c, face.a, midPointCache);
        const i = ndx * 4;
        newFaces[i + 0] = new Face(face.a, mAB, mCA);
        newFaces[i + 1] = new Face(face.b, mBC, mAB);
        newFaces[i + 2] = new Face(face.c, mCA, mBC);
        newFaces[i + 3] = new Face(mAB, mBC, mCA);
      });
      f = newFaces;
    }
    this.faces = f;
    return this;
  }

  spherize(radius = 1) {
    this.vertices.forEach((vertex) => {
      vec3.normalize(vertex.normal, vertex.position);
      vec3.scale(vertex.position, vertex.normal, radius);
    });
    return this;
  }

  get data() {
    return {
      vertices: this.vertexData,
      indices: this.indexData,
      normals: this.normalData,
      uvs: this.uvData,
    };
  }
  get vertexData() {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.position)));
  }
  get normalData() {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.normal)));
  }
  get uvData() {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.uv)));
  }
  get indexData() {
    return new Uint16Array(this.faces.flatMap((f) => [f.a, f.b, f.c]));
  }
  getMidPoint(ndxA: number, ndxB: number, cache: Record<string, number>) {
    const cacheKey = ndxA < ndxB ? `k_${ndxB}_${ndxA}` : `k_${ndxA}_${ndxB}`;
    if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) return cache[cacheKey];
    const a = this.vertices[ndxA].position;
    const b = this.vertices[ndxB].position;
    const ndx = this.vertices.length;
    cache[cacheKey] = ndx;
    this.addVertex((a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5, (a[2] + b[2]) * 0.5);
    return ndx;
  }
}

class IcosahedronGeometry extends Geometry {
  constructor() {
    super();
    const t = Math.sqrt(5) * 0.5 + 0.5;
    this.addVertex(
      -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0,
      0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t,
      t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1
    ).addFace(
      0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
      1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8,
      3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
      4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
    );
  }
}

class DiscGeometry extends Geometry {
  constructor(steps = 4, radius = 1) {
    super();
    steps = Math.max(4, steps);
    const alpha = (2 * Math.PI) / steps;
    this.addVertex(0, 0, 0);
    this.lastVertex.uv[0] = 0.5;
    this.lastVertex.uv[1] = 0.5;
    for (let i = 0; i < steps; ++i) {
      const x = Math.cos(alpha * i);
      const y = Math.sin(alpha * i);
      this.addVertex(radius * x, radius * y, 0);
      this.lastVertex.uv[0] = x * 0.5 + 0.5;
      this.lastVertex.uv[1] = y * 0.5 + 0.5;
      if (i > 0) this.addFace(0, i, i + 1);
    }
    this.addFace(0, steps, 1);
  }
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(
  gl: WebGL2RenderingContext,
  shaderSources: [string, string],
  attribLocations?: Record<string, number>
) {
  const program = gl.createProgram()!;
  [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx]);
    if (shader) gl.attachShader(program, shader);
  });
  if (attribLocations) {
    for (const attrib in attribLocations) {
      gl.bindAttribLocation(program, attribLocations[attrib], attrib);
    }
  }
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function makeVertexArray(
  gl: WebGL2RenderingContext,
  bufLocNumElmPairs: [WebGLBuffer, number, number][],
  indices: Uint16Array
) {
  const va = gl.createVertexArray()!;
  gl.bindVertexArray(va);
  for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
    if (loc === -1) continue;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, numElem, gl.FLOAT, false, 0, 0);
  }
  if (indices) {
    const indexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  }
  gl.bindVertexArray(null);
  return va;
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const dpr = Math.min(1.5, window.devicePixelRatio);
  const displayWidth = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);
  const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize;
}

function makeBuffer(gl: WebGL2RenderingContext, sizeOrData: ArrayBufferView | number, usage: number) {
  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  // Cast — TS' lib types insist on ArrayBuffer-backed views, but Float32Array
  // backed by ArrayBufferLike works fine at runtime in WebGL.
  gl.bufferData(gl.ARRAY_BUFFER, sizeOrData as ArrayBufferView, usage);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buf;
}

function createAndSetupTexture(
  gl: WebGL2RenderingContext,
  minFilter: number,
  magFilter: number,
  wrapS: number,
  wrapT: number
) {
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  return texture;
}

class ArcballControl {
  isPointerDown = false;
  orientation = quat.create();
  pointerRotation = quat.create();
  rotationVelocity = 0;
  rotationAxis = vec3.fromValues(1, 0, 0);
  snapDirection = vec3.fromValues(0, 0, -1);
  snapTargetDirection: vec3 | null = null;
  EPSILON = 0.1;
  IDENTITY_QUAT = quat.create();
  pointerPos = vec2.create();
  previousPointerPos = vec2.create();
  _rotationVelocity = 0;
  _combinedQuat = quat.create();
  canvas: HTMLCanvasElement;
  updateCallback: (deltaTime: number) => void;

  constructor(canvas: HTMLCanvasElement, updateCallback?: (deltaTime: number) => void) {
    this.canvas = canvas;
    this.updateCallback = updateCallback || (() => null);
    canvas.addEventListener("pointerdown", (e) => {
      vec2.set(this.pointerPos, e.clientX, e.clientY);
      vec2.copy(this.previousPointerPos, this.pointerPos);
      this.isPointerDown = true;
    });
    canvas.addEventListener("pointerup", () => {
      this.isPointerDown = false;
    });
    canvas.addEventListener("pointerleave", () => {
      this.isPointerDown = false;
    });
    canvas.addEventListener("pointermove", (e) => {
      if (this.isPointerDown) vec2.set(this.pointerPos, e.clientX, e.clientY);
    });
    canvas.style.touchAction = "none";
  }

  update(deltaTime: number, targetFrameDuration = 16) {
    const timeScale = deltaTime / targetFrameDuration + 0.00001;
    let angleFactor = timeScale;
    const snapRotation = quat.create();

    if (this.isPointerDown) {
      const INTENSITY = 0.3 * timeScale;
      const ANGLE_AMPLIFICATION = 5 / timeScale;
      const midPointerPos = vec2.sub(vec2.create(), this.pointerPos, this.previousPointerPos);
      vec2.scale(midPointerPos, midPointerPos, INTENSITY);

      if (vec2.sqrLen(midPointerPos) > this.EPSILON) {
        vec2.add(midPointerPos, this.previousPointerPos, midPointerPos);
        const p = this._project(midPointerPos);
        const q = this._project(this.previousPointerPos);
        const a = vec3.normalize(vec3.create(), p);
        const b = vec3.normalize(vec3.create(), q);
        vec2.copy(this.previousPointerPos, midPointerPos);
        angleFactor *= ANGLE_AMPLIFICATION;
        this.quatFromVectors(a, b, this.pointerRotation, angleFactor);
      } else {
        quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, INTENSITY);
      }
    } else {
      const INTENSITY = 0.1 * timeScale;
      quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, INTENSITY);
      if (this.snapTargetDirection) {
        const SNAPPING_INTENSITY = 0.2;
        const a = this.snapTargetDirection;
        const b = this.snapDirection;
        const sqrDist = vec3.squaredDistance(a, b);
        const distanceFactor = Math.max(0.1, 1 - sqrDist * 10);
        angleFactor *= SNAPPING_INTENSITY * distanceFactor;
        this.quatFromVectors(a, b, snapRotation, angleFactor);
      }
    }

    const combinedQuat = quat.multiply(quat.create(), snapRotation, this.pointerRotation);
    this.orientation = quat.multiply(quat.create(), combinedQuat, this.orientation);
    quat.normalize(this.orientation, this.orientation);

    const RA_INTENSITY = 0.8 * timeScale;
    quat.slerp(this._combinedQuat, this._combinedQuat, combinedQuat, RA_INTENSITY);
    quat.normalize(this._combinedQuat, this._combinedQuat);

    const rad = Math.acos(this._combinedQuat[3]) * 2.0;
    const s = Math.sin(rad / 2.0);
    let rv = 0;
    if (s > 0.000001) {
      rv = rad / (2 * Math.PI);
      this.rotationAxis[0] = this._combinedQuat[0] / s;
      this.rotationAxis[1] = this._combinedQuat[1] / s;
      this.rotationAxis[2] = this._combinedQuat[2] / s;
    }

    const RV_INTENSITY = 0.5 * timeScale;
    this._rotationVelocity += (rv - this._rotationVelocity) * RV_INTENSITY;
    this.rotationVelocity = this._rotationVelocity / timeScale;

    this.updateCallback(deltaTime);
  }

  quatFromVectors(a: vec3, b: vec3, out: quat, angleFactor = 1) {
    const axis = vec3.cross(vec3.create(), a, b);
    vec3.normalize(axis, axis);
    const d = Math.max(-1, Math.min(1, vec3.dot(a, b)));
    const angle = Math.acos(d) * angleFactor;
    quat.setAxisAngle(out, axis, angle);
    return { q: out, axis, angle };
  }

  _project(pos: vec2) {
    const r = 2;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const s = Math.max(w, h) - 1;
    const x = (2 * pos[0] - w - 1) / s;
    const y = (2 * pos[1] - h - 1) / s;
    let z = 0;
    const xySq = x * x + y * y;
    const rSq = r * r;
    if (xySq <= rSq / 2.0) z = Math.sqrt(rSq - xySq);
    else z = rSq / Math.sqrt(xySq);
    return vec3.fromValues(-x, y, z);
  }
}

class InfiniteGridMenu {
  TARGET_FRAME_DURATION = 1000 / 60;
  SPHERE_RADIUS = 2;
  _time = 0;
  _deltaTime = 0;
  _frames = 0;

  camera = {
    matrix: mat4.create(),
    near: 0.1,
    far: 40,
    fov: Math.PI / 4,
    aspect: 1,
    position: vec3.fromValues(0, 0, 3),
    up: vec3.fromValues(0, 1, 0),
    matrices: {
      view: mat4.create(),
      projection: mat4.create(),
      inversProjection: mat4.create(),
    },
  };

  smoothRotationVelocity = 0;
  scaleFactor = 1.0;
  movementActive = false;

  canvas: HTMLCanvasElement;
  items: InfiniteMenuItem[];
  onActiveItemChange: (i: number) => void;
  onMovementChange: (m: boolean) => void;

  gl!: WebGL2RenderingContext;
  viewportSize!: vec2;
  drawBufferSize!: vec2;
  discProgram!: WebGLProgram;
  discLocations!: Record<string, WebGLUniformLocation | number>;
  discGeo!: DiscGeometry;
  discBuffers!: {
    vertices: Float32Array;
    indices: Uint16Array;
    normals: Float32Array;
    uvs: Float32Array;
  };
  discVAO!: WebGLVertexArrayObject;
  icoGeo!: IcosahedronGeometry;
  instancePositions!: vec3[];
  DISC_INSTANCE_COUNT!: number;
  discInstances!: { matricesArray: Float32Array; matrices: Float32Array[]; buffer: WebGLBuffer };
  worldMatrix = mat4.create();
  tex!: WebGLTexture;
  atlasSize = 1;
  control!: ArcballControl;
  rafId: number | null = null;
  disposed = false;

  constructor(
    canvas: HTMLCanvasElement,
    items: InfiniteMenuItem[],
    onActiveItemChange: (i: number) => void,
    onMovementChange: (m: boolean) => void,
    scale = 1.0
  ) {
    this.canvas = canvas;
    this.items = items;
    this.onActiveItemChange = onActiveItemChange;
    this.onMovementChange = onMovementChange;
    this.scaleFactor = scale;
    this.camera.position[2] = 3 * scale;
    this._init();
  }

  resize() {
    this.viewportSize = vec2.set(this.viewportSize || vec2.create(), this.canvas.clientWidth, this.canvas.clientHeight);
    const gl = this.gl;
    if (resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement)) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    this._updateProjectionMatrix(gl);
  }

  run = (time = 0) => {
    if (this.disposed) return;
    this._deltaTime = Math.min(32, time - this._time);
    this._time = time;
    this._frames += this._deltaTime / this.TARGET_FRAME_DURATION;
    this._animate(this._deltaTime);
    this._render();
    this.rafId = requestAnimationFrame(this.run);
  };

  dispose() {
    this.disposed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    const gl = this.gl;
    if (!gl) return;
    try {
      gl.deleteProgram(this.discProgram);
      gl.deleteTexture(this.tex);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    } catch {
      /* noop */
    }
  }

  _init() {
    this.gl = this.canvas.getContext("webgl2", { antialias: true, alpha: true })!;
    const gl = this.gl;
    if (!gl) throw new Error("No WebGL 2 context");

    this.viewportSize = vec2.fromValues(this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawBufferSize = vec2.clone(this.viewportSize);

    this.discProgram = createProgram(gl, [discVertShaderSource, discFragShaderSource], {
      aModelPosition: 0,
      aModelNormal: 1,
      aModelUvs: 2,
      aInstanceMatrix: 3,
    })!;

    this.discLocations = {
      aModelPosition: gl.getAttribLocation(this.discProgram, "aModelPosition"),
      aModelUvs: gl.getAttribLocation(this.discProgram, "aModelUvs"),
      aInstanceMatrix: gl.getAttribLocation(this.discProgram, "aInstanceMatrix"),
      uWorldMatrix: gl.getUniformLocation(this.discProgram, "uWorldMatrix")!,
      uViewMatrix: gl.getUniformLocation(this.discProgram, "uViewMatrix")!,
      uProjectionMatrix: gl.getUniformLocation(this.discProgram, "uProjectionMatrix")!,
      uCameraPosition: gl.getUniformLocation(this.discProgram, "uCameraPosition")!,
      uRotationAxisVelocity: gl.getUniformLocation(this.discProgram, "uRotationAxisVelocity")!,
      uTex: gl.getUniformLocation(this.discProgram, "uTex")!,
      uItemCount: gl.getUniformLocation(this.discProgram, "uItemCount")!,
      uAtlasSize: gl.getUniformLocation(this.discProgram, "uAtlasSize")!,
    };

    this.discGeo = new DiscGeometry(56, 1);
    this.discBuffers = this.discGeo.data;
    this.discVAO = makeVertexArray(
      gl,
      [
        [makeBuffer(gl, this.discBuffers.vertices, gl.STATIC_DRAW), this.discLocations.aModelPosition as number, 3],
        [makeBuffer(gl, this.discBuffers.uvs, gl.STATIC_DRAW), this.discLocations.aModelUvs as number, 2],
      ],
      this.discBuffers.indices
    );

    this.icoGeo = new IcosahedronGeometry();
    this.icoGeo.subdivide(1).spherize(this.SPHERE_RADIUS);
    this.instancePositions = this.icoGeo.vertices.map((v) => v.position);
    this.DISC_INSTANCE_COUNT = this.icoGeo.vertices.length;
    this._initDiscInstances(this.DISC_INSTANCE_COUNT);

    this._initTexture();

    this.control = new ArcballControl(this.canvas, (deltaTime) => this._onControlUpdate(deltaTime));

    this._updateCameraMatrix();
    this._updateProjectionMatrix(gl);
    this.resize();
  }

  _initTexture() {
    const gl = this.gl;
    this.tex = createAndSetupTexture(gl, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);

    const itemCount = Math.max(1, this.items.length);
    this.atlasSize = Math.ceil(Math.sqrt(itemCount));
    const cellSize = 512;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = this.atlasSize * cellSize;
    canvas.height = this.atlasSize * cellSize;

    // Load every image (or null when the item has no `image` set).
    const loaders = this.items.map(
      (item) =>
        new Promise<HTMLImageElement | null>((resolve) => {
          if (!item.image) return resolve(null);
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = item.image;
        })
    );

    Promise.all(loaders).then((images) => {
      if (this.disposed) return;
      images.forEach((img, i) => {
        const item = this.items[i];
        const x = (i % this.atlasSize) * cellSize;
        const y = Math.floor(i / this.atlasSize) * cellSize;
        drawTile(ctx, x, y, cellSize, item, img);
      });
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
      gl.generateMipmap(gl.TEXTURE_2D);
    });
  }

  _initDiscInstances(count: number) {
    const gl = this.gl;
    this.discInstances = {
      matricesArray: new Float32Array(count * 16),
      matrices: [],
      buffer: gl.createBuffer()!,
    };
    for (let i = 0; i < count; ++i) {
      const m = new Float32Array(this.discInstances.matricesArray.buffer, i * 16 * 4, 16);
      m.set(mat4.create());
      this.discInstances.matrices.push(m);
    }
    gl.bindVertexArray(this.discVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.discInstances.matricesArray.byteLength, gl.DYNAMIC_DRAW);
    const bytesPerMatrix = 16 * 4;
    for (let j = 0; j < 4; ++j) {
      const loc = (this.discLocations.aInstanceMatrix as number) + j;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, j * 4 * 4);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  _animate(deltaTime: number) {
    const gl = this.gl;
    this.control.update(deltaTime, this.TARGET_FRAME_DURATION);
    const positions = this.instancePositions.map((p) => vec3.transformQuat(vec3.create(), p, this.control.orientation));
    const scale = 0.25;
    const SCALE_INTENSITY = 0.6;
    positions.forEach((p, ndx) => {
      const s = (Math.abs(p[2]) / this.SPHERE_RADIUS) * SCALE_INTENSITY + (1 - SCALE_INTENSITY);
      const finalScale = s * scale;
      const matrix = mat4.create();
      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), vec3.negate(vec3.create(), p)));
      mat4.multiply(matrix, matrix, mat4.targetTo(mat4.create(), [0, 0, 0], p, [0, 1, 0]));
      mat4.multiply(matrix, matrix, mat4.fromScaling(mat4.create(), [finalScale, finalScale, finalScale]));
      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), [0, 0, -this.SPHERE_RADIUS]));
      mat4.copy(this.discInstances.matrices[ndx], matrix);
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.discInstances.matricesArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.smoothRotationVelocity = this.control.rotationVelocity;
  }

  _render() {
    const gl = this.gl;
    gl.useProgram(this.discProgram);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(this.discLocations.uWorldMatrix as WebGLUniformLocation, false, this.worldMatrix);
    gl.uniformMatrix4fv(this.discLocations.uViewMatrix as WebGLUniformLocation, false, this.camera.matrices.view);
    gl.uniformMatrix4fv(
      this.discLocations.uProjectionMatrix as WebGLUniformLocation,
      false,
      this.camera.matrices.projection
    );
    gl.uniform3f(
      this.discLocations.uCameraPosition as WebGLUniformLocation,
      this.camera.position[0],
      this.camera.position[1],
      this.camera.position[2]
    );
    gl.uniform4f(
      this.discLocations.uRotationAxisVelocity as WebGLUniformLocation,
      this.control.rotationAxis[0],
      this.control.rotationAxis[1],
      this.control.rotationAxis[2],
      this.smoothRotationVelocity * 1.1
    );
    gl.uniform1i(this.discLocations.uItemCount as WebGLUniformLocation, this.items.length);
    gl.uniform1i(this.discLocations.uAtlasSize as WebGLUniformLocation, this.atlasSize);
    gl.uniform1i(this.discLocations.uTex as WebGLUniformLocation, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.bindVertexArray(this.discVAO);
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      this.discBuffers.indices.length,
      gl.UNSIGNED_SHORT,
      0,
      this.DISC_INSTANCE_COUNT
    );
  }

  _updateCameraMatrix() {
    mat4.targetTo(this.camera.matrix, this.camera.position, [0, 0, 0], this.camera.up);
    mat4.invert(this.camera.matrices.view, this.camera.matrix);
  }

  _updateProjectionMatrix(gl: WebGL2RenderingContext) {
    this.camera.aspect = (gl.canvas as HTMLCanvasElement).clientWidth / (gl.canvas as HTMLCanvasElement).clientHeight;
    const height = this.SPHERE_RADIUS * 0.35;
    const distance = this.camera.position[2];
    if (this.camera.aspect > 1) this.camera.fov = 2 * Math.atan(height / distance);
    else this.camera.fov = 2 * Math.atan(height / this.camera.aspect / distance);
    mat4.perspective(this.camera.matrices.projection, this.camera.fov, this.camera.aspect, this.camera.near, this.camera.far);
    mat4.invert(this.camera.matrices.inversProjection, this.camera.matrices.projection);
  }

  _onControlUpdate(deltaTime: number) {
    const timeScale = deltaTime / this.TARGET_FRAME_DURATION + 0.0001;
    let damping = 5 / timeScale;
    let cameraTargetZ = 3 * this.scaleFactor;
    const isMoving = this.control.isPointerDown || Math.abs(this.smoothRotationVelocity) > 0.01;
    if (isMoving !== this.movementActive) {
      this.movementActive = isMoving;
      this.onMovementChange(isMoving);
    }
    if (!this.control.isPointerDown) {
      const nearestVertexIndex = this._findNearestVertexIndex();
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);
      const snapDirection = vec3.normalize(vec3.create(), this._getVertexWorldPosition(nearestVertexIndex));
      this.control.snapTargetDirection = snapDirection;
    } else {
      cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
      damping = 7 / timeScale;
    }
    this.camera.position[2] += (cameraTargetZ - this.camera.position[2]) / damping;
    this._updateCameraMatrix();
  }

  _findNearestVertexIndex() {
    const n = this.control.snapDirection;
    const inversOrientation = quat.conjugate(quat.create(), this.control.orientation);
    const nt = vec3.transformQuat(vec3.create(), n, inversOrientation);
    let maxD = -1;
    let nearestVertexIndex = 0;
    for (let i = 0; i < this.instancePositions.length; ++i) {
      const d = vec3.dot(nt, this.instancePositions[i]);
      if (d > maxD) {
        maxD = d;
        nearestVertexIndex = i;
      }
    }
    return nearestVertexIndex;
  }

  _getVertexWorldPosition(index: number) {
    const nearestVertexPos = this.instancePositions[index];
    return vec3.transformQuat(vec3.create(), nearestVertexPos, this.control.orientation);
  }
}

export default function InfiniteMenu({
  items,
  scale = 1.0,
  accent = "#D4D4D4",
}: {
  items: InfiniteMenuItem[];
  scale?: number;
  accent?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeItem, setActiveItem] = useState<InfiniteMenuItem | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;
    let sketch: InfiniteGridMenu | null = null;
    const handleActive = (index: number) => {
      const i = index % items.length;
      setActiveItem(items[i]);
    };
    sketch = new InfiniteGridMenu(canvas, items, handleActive, setIsMoving, scale);
    sketch.run();

    const onResize = () => sketch?.resize();
    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      sketch?.dispose();
    };
  }, [items, scale]);

  // Use the active item's accent if it carries one, otherwise the prop default
  const liveAccent = activeItem?.accent ?? accent;

  return (
    <div className="relative w-full h-full grid md:grid-cols-[minmax(0,_1fr)_minmax(0,_1.4fr)] gap-6 md:gap-8 items-stretch">
      {/* Left — info panel */}
      <div
        className={`relative z-10 flex flex-col justify-center md:px-2 lg:px-4 transition-opacity duration-500 ${
          isMoving ? "opacity-50" : "opacity-100"
        }`}
      >
        {activeItem ? (
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <span className="h-px w-10" style={{ backgroundColor: liveAccent }} />
              <span
                className="font-mono text-[11px] uppercase tracking-[0.4em]"
                style={{ color: liveAccent }}
              >
                {activeItem.index ? `${activeItem.index} · Selected` : "Selected"}
              </span>
            </div>

            <h3 className="mt-5 font-[family-name:var(--font-display)] text-heading text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[0.01em]">
              {activeItem.title}
            </h3>

            <p className="mt-5 font-[family-name:var(--font-serif)] italic text-text text-lg md:text-xl lg:text-2xl leading-[1.4] max-w-md">
              {activeItem.description}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                activeItem.onSelect();
              }}
              aria-label={`Open ${activeItem.title}`}
              className="mt-10 group inline-flex items-center gap-3 px-6 py-3.5 border-2 text-xs font-[family-name:var(--font-display)] tracking-[0.3em] uppercase bg-bg/60 backdrop-blur-md transition-all hover:scale-[1.04]"
              style={{ borderColor: liveAccent, color: liveAccent }}
            >
              <span>Step inside</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-text/70">
              Drag the sphere to change selection
            </p>
          </div>
        ) : (
          <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-muted">
            Loading…
          </div>
        )}
      </div>

      {/* Right — sphere */}
      <div className="relative w-full h-full min-h-[420px]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block cursor-grab active:cursor-grabbing"
        />
      </div>
    </div>
  );
}
