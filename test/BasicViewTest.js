import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

const hostname = `file://${process.cwd()}/../html/index.html`;

export class BasicViewTest extends TestBase
{
	testScroll()
	{
		const name = 'testScroll';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => new Promise(accept => {
		// 	setTimeout(accept, 500000);
		// }));

		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, result
		));
	}
}

