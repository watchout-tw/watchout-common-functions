import argparse
import json

from os import listdir
from os.path import isfile, join

def read_files(folder):
  # TODO: should support layers of folders
  # TODO: should append directory path
  return [file for file in listdir(folder) if isfile(join(folder, file))]

def output_json(path, data):
  with open(path, 'w') as outfile:
      json.dump(data, outfile)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', help='input folder path', type=str)
    parser.add_argument('--output', help='output json file path', type=str)
    args = parser.parse_args()
    # TODO check arguments are presented

    files = read_files(args.input)
    data = {'paths': files}
    output_json(args.output, data)


if __name__ == '__main__':
    main()
