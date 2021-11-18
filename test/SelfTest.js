import { TestBase } from './TestBase';

const hostname = `file://${process.cwd()}/../html/index.html`;

const testInjection = () => {
	document.write('!!!Injection successful !!!');
	return document.body.innerHTML;
};

export class SelfTest extends TestBase
{
	testInjection()
	{
		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(testInjection))
		.then(result => {

			const injectedString = '!!!Injection successful !!!';

			this.assert(
				injectedString === result
				, 'Injection result is not injected string.'
			);
		});
	}
}
