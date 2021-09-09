.PHONY: all package dist min clean

all: package dist min

package:
	npx babel source/ --out-dir .

dist:
	NODE_ENV=prod npx babel source/ --no-comments --out-file dist/cv2-hyperscroll.js

min:
	NODE_ENV=prod-min npx babel source/ --no-comments --out-file dist/cv2-hyperscroll.min.js

dependencies:
	npm install

clean:
	rm -rf HyperScroller.js RecordSet.js Row.js dist/*
