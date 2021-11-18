import { Test } from 'cv3-test/Test';
import { rawquire } from 'rawquire/rawquire.macro';

const Pobot = require('pobot/Pobot');

export class TestBase extends Test
{
	options = !process.env.VISIBLE
		? ['--headless', '--disable-gpu']
		: []

	setUp()
	{
		return Pobot.get(this.options)
		.then(pobot=> this.pobot = pobot);
	}

	breakDown()
	{
		return this.pobot.kill();
	}
}
