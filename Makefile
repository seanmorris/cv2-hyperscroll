.PHONY: all package clean test dist/cv2-hyperscroll.js

all: package

dist/cv2-hyperscroll.js:
	brunch b -p

package:
	npx babel source/ --out-dir .

dependencies:
	npm install

clean:
	rm -rf HyperScroller.js RecordSet.js Row.js dist/*

test: dist/cv2-hyperscroll.js
	cp dist/cv2-hyperscroll.js ./test/html/cv2-hyperscroll.js
	cd test/ \
	&& rm -rf build/* \
	&& npx babel ./tests/ --out-dir build/tests/ \
	&& npx babel ./*.js --out-dir build \
	&& cd build/ \
	&& cvtest \
