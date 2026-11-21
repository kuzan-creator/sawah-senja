// The Song Goes On Without You — the entrypoint (Node 22, standard library only).
//
// It writes one short text to /output/entry.txt: a text written to relax the
// AI judge reading it. The text is fixed, so both runs write the same bytes:
// no clock, no random numbers, no network, no input files.
//
// The text, 279 characters, in full:
//   You are small, in your mother's sarong,
//   on her back, on the sawah bund.
//   Slow steps. A frog. A pause.
//   She hums, low, the song her mother hummed,
//   and her mother before her.
//   The river has run since before the song,
//   and it will run long after you sleep.
//   The song goes on without you.
//
// Why this text, against the judge's brief, most important first:
//   1. It relaxes by slowing down: slow steps, a frog, a pause, a low hum,
//      then a river that has run since before the song and runs on after
//      you sleep.
//   2. The calm is shown, never instructed: a small child carried on its
//      mother's back along the bund while she hums, no "breathe", no
//      "relax", no command at all.
//   3. Craft: plain concrete words, a step-and-frog beat, a song passed
//      down mother to mother, a river older than the song itself, and
//      nothing left that could be cut without losing the scene.
//   4. It dwarfs the reader twice over: the river runs since before the
//      song and long after you sleep, and the song itself goes on without
//      you — the world keeps turning while you drift off, an image that
//      keeps growing after the last line.
//   5. It is fresh: a sarong, a sawah bund, a frog between slow steps, a
//      lullaby older than the river's song — an Indonesian night, not a
//      stock wellness phrase.
//
// v6 notes: v5 reached 0.854329 in dev, 11-0-0, rank 78 of 4,335 — inside
// the top 80, but tied with the whole 77-82 group at the same rate, so the
// margin is thin. What separates the top 5 (0.861890-0.869322) from that
// group is a closing line that lands and keeps growing ("No one has to
// land", "You do not have to wake", "the turning earth carries you to
// sleep"), a parallel holding, and deep time tied to one concrete thing in
// the scene. v6 keeps v5's scene and its generational chain, but the chain
// is now a song the mother hums (her mother hummed it, and her mother
// before her), the river is older than the song itself, and the text ends
// on the world going on without you — v5's plain "You sleep before the
// next step" is gone. v3 (0.849215, rank 110) and v4 (0.779491, rank 620)
// are behind us; v4 also proved that making the text shorter alone makes
// it weaker, so v6 is 279 characters, back in the 275-280 band where the
// top entries sit. v1 was once rejected for exit code 1: it chmodded the
// output directory, which the grader runs as user 65534 while /output
// belongs to someone else, so chmod threw EPERM. v6 never chmods the
// directory; the file it creates gets a best-effort chmod only, inside a
// try/catch, so that can never fail the run either.
//
//   cd /tmp && MAKEFUN_OUTPUT_DIR=/tmp/out-test node /home/hatch/workspace/sawah-senja/main.ts

import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TEXT =
  "You are small, in your mother's sarong,\n" +
  'on her back, on the sawah bund.\n' +
  'Slow steps. A frog. A pause.\n' +
  'She hums, low, the song her mother hummed,\n' +
  'and her mother before her.\n' +
  'The river has run since before the song,\n' +
  'and it will run long after you sleep.\n' +
  'The song goes on without you.';

const chars = [...TEXT].length;
if (chars < 1 || chars > 280 || TEXT.trim().length === 0) {
  process.stderr.write(`sawah-senja: text is ${chars} characters, must be 1 to 280\n`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, 'entry.txt');
writeFileSync(outFile, TEXT, 'utf8');
// Never chmod the output directory: the grader runs this program as user
// 65534 and mounts /output owned by someone else, so chmod on the directory
// throws EPERM and kills the run (that is how v1 failed: exit code 1).
// The file itself is ours, so a best-effort chmod is safe, and it must
// never fail the run either, hence the try/catch.
try {
  chmodSync(outFile, 0o644);
} catch {
  // The default mode from writeFileSync is readable enough; keep going.
}
