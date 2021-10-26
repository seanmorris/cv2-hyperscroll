.PHONY: all package clean

all: package

package:
	npx babel source/ --out-dir .

dependencies:
	npm install

clean:
	rm -rf HyperScroller.js RecordSet.js Row.js dist/*
