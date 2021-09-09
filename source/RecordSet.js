import { Bindable } from 'curvature/base/Bindable';

const _Fetch = Symbol('_Fetch');

export class RecordSet
{
	length  = 0;

	constructor()
	{
		this.length = 1000;

		const get = (t, k) => {

			if(k === 'length')
			{
				return this.count();
			}

			if(typeof k === 'symbol' || parseInt(k) !== Number(k))
			{
				return t[k];
			}

			return this[_Fetch](Number(k));
		};

		// const set = (t, k, v) => {

		// 	// if(typeof k === 'symbol' || parseInt(k) !== Number(k))
		// 	// {
		// 	// 	return true;
		// 	// }

		// 	return true;
		// };

		const del = (t, k) => {
			return true;
		};

		return Bindable.make(new Proxy(this, {get}));
	}

	count()
	{
		return this.length;
	}

	header()
	{
		return false;
	}

	[_Fetch](k)
	{
		const header = this.header();

		if(k === 0 && header)
		{
			header.___header = 'is-header';

			return header;
		}

		if(!this.content)
		{
			this.content = [];
		}

		if(!this.content[k])
		{
			this.content[k] = this.fetch(k);
		}

		return this.content[k]
	}

	fetch(k)
	{
		return undefined;
	}
}
