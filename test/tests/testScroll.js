export const testScroll = () => {

	const HyperScroller = require('cv2-hyperscroll/HyperScroller').HyperScroller;
	const RecordSet     = require('cv2-hyperscroll/RecordSet').RecordSet;

	const records = new RecordSet;

	records.fetch = k => {
		if(k in records.content)
		{
			return records.content[k];
		}

		let kk = k;

		records.offsets.forEach((offset, index) => {
			offset = Number(offset);
			index  = Number(index);

			if(k > index)
			{
				kk -= offset;
			}
		});

		return `String #${kk}!`
	};

	records.length = 1000000;

	const View = require('curvature/base/View').View;
	const view = View.from('<div>[[scroller]]</div>\n');

	document.body.style.height = '825px';

	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	view.render(document.body);

	setTimeout(() => {

		const scroller = new HyperScroller({rowHeight: 33});

		scroller.args.content = records;

		view.args.scroller = scroller;

		setTimeout(() => {

			records[10] = 'Before 10!';

			records[92] = 'Before 91!';

		}, 1000);

		scroller.tags.list.scrollTo({top: -120 + scroller.tags.list.scrollHeight});

	}, 500);

	return new Promise(accept => {
		setTimeout(() => accept(document.body.innerHTML), 2000);
	});
};

// 600
// 89 -> 89
// 90 -> LMAO
// 91 -> 90
// 92 -> 92
// 100 -> 100

// 100
// 89 -> 89
// 90 -> LMAO
// 91 -> 90
// 92 -> 91
// 100 -> 99
