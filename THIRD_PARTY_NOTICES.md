# Third-party notices (akasha)

The release tree of this plugin ships one third-party component: the pure-Python wheel in `wheels/`.
Everything else akasha imports (numpy, numba and its llvmlite, threadpoolctl) is installed into the plugin's own environment from PyPI at deploy time, and its license files travel inside those wheels; none of it is part of this repository or the release tree.

## jieba 0.42.1 (MIT)

- File: `wheels/jieba-0.42.1-py3-none-any.whl`, built from the PyPI source distribution `jieba-0.42.1.tar.gz` (sha256 `055ca12f62674fafed09427f176506079bc135638a14e23e25be909131928db2`) by `scripts/bundled_wheels.py` with the pins in `wheels.lock.json`; the wheel is byte-for-byte reproducible from that sdist.
- Source: https://github.com/fxsjy/jieba
- Copyright (c) 2013 Sun Junyi
- License text (verbatim from the upstream repository at tag v0.42.1; the PyPI sdist and wheel carry no license file):

```
The MIT License (MIT)

Copyright (c) 2013 Sun Junyi

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
