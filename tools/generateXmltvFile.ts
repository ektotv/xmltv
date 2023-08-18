#!/usr/bin/env -S ts-node --esm
import { ArgumentParser } from 'argparse';
import { writeXmltv } from '../src/main.js';
import type { Xmltv } from '../src/types.js';

/**
 * Generate a xmltv file with the given number of channels and programmes
 *
 * Usage:
 *   ./generateXml.ts -c 100 -p 250000 > tests/fixtures/c100-p250_000.xml
 *   ./generateXml.ts --channels 100 --programmes 250000 > tests/fixtures/c100-p250_000.xml
 */
const parser = new ArgumentParser({
  description: 'Generate xmltv xml file',
});

parser.add_argument('-c', '--channels', {
  help: 'Number of channels to generate',
  required: true,
});
parser.add_argument('-p', '--programmes', {
  help: 'Number of programmes to generate',
  required: true,
});
const { channels: numberOfChannels, programmes: numberOfProgrammes } = parser.parse_args();

const channelFactory = (count: number) => {
  const channels: any = [];
  for (let i = 0; i < count; i++) {
    channels.push({
      id: `${i + 1}`,
      displayName: [{ _value: `Channel ${i + 1}` }],
    });
  }
  return channels;
};

const programmeFactory = (count: number) => {
  const programmes: any = [];
  let currentStartTime = new Date(Date.now() - 4 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const duration = Math.floor(Math.random() * 180) + 30;
    const end = new Date(currentStartTime.getTime() + duration * 60 * 1000);

    programmes.push({
      title: `Programme ${i + 1}`,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquam nisl',
      start: currentStartTime,
      stop: end,
      channel: `${Math.floor(Math.random() * numberOfChannels) + 1}`,
    });

    currentStartTime = end;
  }

  return programmes;
};

const channels = channelFactory(numberOfChannels);
const programmes = programmeFactory(numberOfProgrammes);

const xmltv: Xmltv = {
  channels,
  programmes: programmes,
};

const xml = writeXmltv(xmltv);

process.stdout.write(xml + '\n');
