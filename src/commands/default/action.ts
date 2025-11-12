import { type ProcessWriteObject, processWrites } from 'oro-functions';

/* eslint-disable unicorn/prefer-string-raw */

const titleSpace = [' ', ' ', ' ', ' ', ' '];
const titleO = [' ______   ', '/\\  __ \\  ', '\\ \\ \\/\\ \\ ', ' \\ \\_____\\', '  \\/_____/'];
const titleR = [' ______   ', '/\\  == \\  ', '\\ \\  __<  ', ' \\ \\_\\ \\_\\', '  \\/_/ /_/'];
const titleG = [' ______   ', '/\\  ___\\  ', '\\ \\ \\__ \\ ', ' \\ \\_____\\', '  \\/_____/'];
const titleI = [' __   ', '/\\ \\  ', '\\ \\ \\ ', ' \\ \\_\\', '  \\/_/'];
const titleT = [' ______ ', '/\\__  _\\', '\\/_/\\ \\/', '   \\ \\_\\', '    \\/_/'];
const titleH = [' __  __   ', '/\\ \\_\\ \\  ', '\\ \\  __ \\ ', ' \\ \\_\\ \\_\\', '  \\/_/\\/_/'];
const titleU = [' __  __   ', '/\\ \\/\\ \\  ', '\\ \\ \\_\\ \\ ', ' \\ \\_____\\', '  \\/_____/'];
const titleB = [' ______   ', '/\\  == \\  ', '\\ \\  __<  ', ' \\ \\_____\\', '  \\/_____/'];
const titleC = [' ______   ', '/\\  ___\\  ', '\\ \\ \\____ ', ' \\ \\_____\\', '  \\/_____/'];
const titleL = [' __       ', '/\\ \\      ', '\\ \\ \\____ ', ' \\ \\_____\\', '  \\/_____/'];

/* eslint-enable */

export async function fnAction(): Promise<void> {
  processWrites([
    { s: '\n' },
    ...Array.from({ length: 5 }).flatMap((_, index): ProcessWriteObject[] => [
      { s: titleSpace[index] },
      { s: titleSpace[index] },
      { s: titleO[index], c: 'yellowflat', a: ['bold'] },
      { s: titleR[index], c: 'yellowflat', a: ['bold'] },
      { s: titleO[index], c: 'yellowflat', a: ['bold'] },
      { s: titleSpace[index] },
      { s: titleSpace[index] },
      { s: titleSpace[index] },
      { s: titleG[index], c: 'gray', a: ['bold'] },
      { s: titleI[index], c: 'gray', a: ['bold'] },
      { s: titleT[index], c: 'gray', a: ['bold'] },
      { s: titleSpace[index] },
      { s: titleH[index], c: 'gray', a: ['bold'] },
      { s: titleU[index], c: 'gray', a: ['bold'] },
      { s: titleB[index], c: 'gray', a: ['bold'] },
      { s: titleSpace[index] },
      { s: titleSpace[index] },
      { s: titleSpace[index] },
      { s: titleC[index], c: 'redflat', a: ['bold'] },
      { s: titleL[index], c: 'redflat', a: ['bold'] },
      { s: titleI[index], c: 'redflat', a: ['bold'] },
      { s: '\n' },
    ]),
    { s: '\n' },
  ]);
}
