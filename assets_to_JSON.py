import argparse
import json

from os import listdir
from os.path import isfile, join

ROOT = "watchout-common-assets/images/"

def strip_root(path):
    index = path.find(ROOT) + len(ROOT)
    return path[index:]

def read_files(folder):
    paths = []
    for file in listdir(folder):
        path = join(folder, file)
        sub_paths = [path] if isfile(path) else read_files(path)
        sub_paths = [strip_root(sub_path) for sub_path in sub_paths]
        paths.extend(sub_paths)
    return paths

def output_json(path, data):
    with open(path, 'w') as outfile:
        json.dump(data, outfile)

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', help='input folder path', type=str)
    parser.add_argument('--output', help='output json file path', type=str)
    args = parser.parse_args()
    if args.input == None:
        raise Exception('argument - input - cannot be null')
    if args.output == None:
        raise Exception('argument - output - cannot be null')
    return args

def main():
    args = parse_args()
    files = read_files(args.input)
    data = {'paths': files}
    output_json(args.output, data)


if __name__ == '__main__':
    main()
