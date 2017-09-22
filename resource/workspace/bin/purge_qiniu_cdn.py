#-*- coding:utf-8

import urllib2
import argparse
import os
import json
import qiniu
import sys

QINIU_ACCESS_KEY = "k7q2vUXF0MXWNvFGeq75Ql6bor1Oln6q97G-lKRh"
QINIU_ACCESS_SECRET = "DF_F7s7yIWM2VwYQLUuo-ogOOftTOqFHtQblkrLx"


def json_decode(str):
    return json.loads(str)


def file_get_contents(file):
    content = ""
    with open(file) as fp:
        content = fp.read()

    return content


class PurgeQiniuCdnCacheHelper:
    def __init__(self, urls, dirs):
        self.urls = urls
        self.dirs = dirs
        auth = qiniu.Auth(QINIU_ACCESS_KEY, QINIU_ACCESS_SECRET)
        self.cdnManager = qiniu.CdnManager(auth)

    def run(self):
        result = self.cdnManager.refresh_urls_and_dirs(self.urls, self.dirs)
        resp = result[0];
        if resp['code'] != 200:
            print >> sys.stderr, resp
            sys.exit(1)
        print result


if __name__ == '__main__':
    argparser = argparse.ArgumentParser()
    argparser.add_argument("--file", default=None, type=str, help="刷新的文件列表")
    argparser.add_argument("--url", default=None, nargs='*', type=str, help="刷新的单个文件列表")
    argparser.add_argument("--dir", default=None, type=str, help="刷新的单个目录")
    args = argparser.parse_args()

    urls = []
    dirs = []

    if args.url != None:
        urls += args.url;

    if args.dir != None:
        dirs.append(args.dir)

    if args.file != None and os.path.isfile(args.file):
        data = json_decode(file_get_contents(args.file))
        urls.extend(data.get("urls", []))
        dirs.extend(data.get("dirs", []))

    purgeHelper = PurgeQiniuCdnCacheHelper(urls, dirs)
    purgeHelper.run()