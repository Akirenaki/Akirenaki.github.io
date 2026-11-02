// Run with `npm test`. Plain node:test, no extra dependencies.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MIN_PANEL_SIZE,
  PANEL_MARGIN,
  keyboardResize,
  parseStoredPanelSize,
  placePanel,
  resizeFrame,
  resizeSheetHeight,
} from "./companion-position.js";

const desktop = { width: 1280, height: 800 };
const size = 76;
const corner = { left: desktop.width - size - 16, top: desktop.height - size - 16, size };

function floating(anchor, viewport = desktop, requested = {}) {
  const placement = placePanel(anchor, viewport, requested);
  assert.equal(placement.mode, "floating");
  return placement;
}

describe("placePanel", () => {
  it("keeps the default size when none is chosen", () => {
    const placement = floating(corner);
    assert.equal(placement.width, 384);
    assert.equal(placement.height, 640);
  });

  it("uses the chosen size and keeps the panel on screen", () => {
    const placement = floating(corner, desktop, { width: 520, height: 400 });
    assert.equal(placement.width, 520);
    assert.equal(placement.height, 400);
    assert.ok(placement.left + placement.width <= desktop.width - PANEL_MARGIN);
    assert.ok(placement.top >= PANEL_MARGIN);
  });

  it("never exceeds the viewport or drops below the minimum", () => {
    const huge = floating(corner, desktop, { width: 9000, height: 9000 });
    assert.equal(huge.width, desktop.width - PANEL_MARGIN * 2);
    assert.ok(huge.top + huge.height <= corner.top);
    const tiny = floating(corner, desktop, { width: 10, height: 10 });
    assert.equal(tiny.width, MIN_PANEL_SIZE.width);
    assert.equal(tiny.height, MIN_PANEL_SIZE.height);
  });

  it("attaches to the mascot's side and says which edges are free", () => {
    const right = floating(corner);
    assert.equal(right.freeHorizontal, "left");
    assert.equal(right.freeVertical, "top");
    assert.equal(right.left + right.width, corner.left + size);
    const topLeft = floating({ left: 16, top: 16, size });
    assert.equal(topLeft.freeHorizontal, "right");
    assert.equal(topLeft.freeVertical, "bottom");
    assert.equal(topLeft.left, 16);
    assert.equal(topLeft.top, 16 + size + 12);
  });

  it("stays inside the viewport on a short landscape screen", () => {
    const short = { width: 900, height: 380 };
    const placement = floating({ left: 400, top: 150, size }, short);
    assert.ok(placement.top >= PANEL_MARGIN);
    assert.ok(placement.top + placement.height <= short.height - PANEL_MARGIN);
  });

  it("uses a bottom sheet on phones, with a height that fits", () => {
    const phone = { width: 390, height: 700 };
    assert.deepEqual(placePanel({ left: 300, top: 500, size }, phone), { mode: "sheet", height: 576 });
    assert.equal(placePanel({ left: 300, top: 500, size }, phone, { height: 9000 }).height, 684);
    assert.equal(placePanel({ left: 300, top: 500, size }, phone, { height: 50 }).height, 320);
  });
});

describe("resizeFrame", () => {
  const start = { left: 700, top: 100, width: 384, height: 500 };

  it("dragging the left edge keeps the right edge fixed", () => {
    const next = resizeFrame(start, ["left"], -100, 0, desktop);
    assert.equal(next.width, 484);
    assert.equal(next.left + next.width, start.left + start.width);
    assert.equal(next.top, start.top);
    assert.equal(next.height, start.height);
  });

  it("dragging the top edge keeps the bottom edge fixed", () => {
    const next = resizeFrame(start, ["top"], 0, -60, desktop);
    assert.equal(next.height, 560);
    assert.equal(next.top + next.height, start.top + start.height);
  });

  it("dragging the right and bottom edges grows towards the free side", () => {
    const next = resizeFrame({ left: 16, top: 100, width: 384, height: 400 }, ["right", "bottom"], 80, 70, desktop);
    assert.deepEqual(next, { left: 16, top: 100, width: 464, height: 470 });
  });

  it("stops at the minimum size without moving the fixed edge", () => {
    const next = resizeFrame(start, ["left", "top"], 900, 900, desktop);
    assert.equal(next.width, MIN_PANEL_SIZE.width);
    assert.equal(next.height, MIN_PANEL_SIZE.height);
    assert.equal(next.left + next.width, start.left + start.width);
    assert.equal(next.top + next.height, start.top + start.height);
  });

  it("stops at the viewport margin (the old version let the panel leave the screen)", () => {
    const next = resizeFrame(start, ["left", "top"], -5000, -5000, desktop);
    assert.equal(next.left, PANEL_MARGIN);
    assert.equal(next.top, PANEL_MARGIN);
    const grown = resizeFrame({ left: 16, top: 16, width: 384, height: 400 }, ["right", "bottom"], 5000, 5000, desktop);
    assert.equal(grown.left + grown.width, desktop.width - PANEL_MARGIN);
    assert.equal(grown.top + grown.height, desktop.height - PANEL_MARGIN);
  });

  it("a drag followed by placing the panel again gives the same frame (no jump on release)", () => {
    const initial = floating(corner);
    const dragged = resizeFrame(initial, [initial.freeHorizontal, initial.freeVertical], -120, -150, desktop);
    const placed = floating(corner, desktop, { width: dragged.width, height: dragged.height });
    assert.deepEqual(
      { left: placed.left, top: placed.top, width: placed.width, height: placed.height },
      dragged,
    );
  });

  it("does the same when the panel hangs below a mascot at the top left", () => {
    const anchor = { left: 16, top: 16, size };
    const initial = floating(anchor, desktop, { height: 300 });
    const dragged = resizeFrame(initial, [initial.freeHorizontal, initial.freeVertical], 200, 120, desktop);
    const placed = floating(anchor, desktop, { width: dragged.width, height: dragged.height });
    assert.deepEqual(
      { left: placed.left, top: placed.top, width: placed.width, height: placed.height },
      dragged,
    );
  });
});

describe("resizeSheetHeight", () => {
  const phone = { width: 390, height: 700 };
  it("dragging the top edge up makes the sheet taller, and stays within bounds", () => {
    assert.equal(resizeSheetHeight(500, -80, phone), 580);
    assert.equal(resizeSheetHeight(500, -5000, phone), 684);
    assert.equal(resizeSheetHeight(500, 5000, phone), 320);
  });
});

describe("keyboardResize", () => {
  const frame = { left: 700, top: 300, width: 384, height: 500 };
  it("moves the edge itself: ArrowLeft on the left edge widens, ArrowRight narrows", () => {
    assert.equal(keyboardResize(frame, "left", "ArrowLeft", false, desktop).width, 408);
    assert.equal(keyboardResize(frame, "left", "ArrowRight", false, desktop).width, 360);
  });
  it("uses a bigger step with Shift and the vertical arrows for top and bottom", () => {
    assert.equal(keyboardResize(frame, "top", "ArrowUp", true, desktop).height, 596);
    assert.equal(keyboardResize(frame, "bottom", "ArrowDown", false, { width: 1280, height: 900 }).height, 524);
  });
  it("ignores keys that mean nothing on that edge", () => {
    assert.equal(keyboardResize(frame, "left", "ArrowUp", false, desktop), null);
    assert.equal(keyboardResize(frame, "top", "ArrowLeft", false, desktop), null);
    assert.equal(keyboardResize(frame, "left", "a", false, desktop), null);
  });
});

describe("parseStoredPanelSize", () => {
  it("accepts a valid size and enforces the minimum", () => {
    assert.deepEqual(parseStoredPanelSize('{"width":500.4,"height":600}'), { width: 500, height: 600 });
    assert.deepEqual(parseStoredPanelSize('{"width":10,"height":10}'), MIN_PANEL_SIZE);
  });
  it("rejects garbage", () => {
    for (const raw of [null, "nope", '{"width":"500","height":600}', '{"width":500}', "null", '{"width":1e999,"height":600}']) {
      assert.equal(parseStoredPanelSize(raw), null, String(raw));
    }
  });
});
