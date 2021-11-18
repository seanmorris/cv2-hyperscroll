import { Bindable } from 'curvature/base/Bindable';
import { Mixin } from 'curvature/base/Mixin';

import { EventTargetMixin } from 'curvature/mixin/EventTargetMixin';

const _Fetch = Symbol('_Fetch');

export class RecordSet extends Mixin.with(EventTargetMixin)
{
	length  = 0;

	constructor()
	{
		super();

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

		this.offsets = new Map;

		const set = (t, k, v) => {

			if(typeof k === 'symbol' || parseInt(k) !== Number(k))
			{
				this[k] = v;

				return true;
			}

			if(!this.content)
			{
				this.content = Bindable.make([]);
			}

			if(this.content[k])
			{
				this.content.splice(k, 0, v);
			}
			else
			{
				this.content[k] = v;
			}

			if(this.offsets.has(k))
			{
				this.offsets.set(k, 1 + Number(this.offsets.get(k)));
			}
			else
			{
				this.offsets.set(k, 1);
			}

			this.length = 1 + this.length;

			this.content[k] = v;

			this.dispatchEvent(new CustomEvent('recordChanged', {detail: {
				key: k, value: v, length: this.length
			}}));

			return true;
		};

		const del = (t, k) => {
			return true;
		};

		return Bindable.make(new Proxy(this, {get, set}));
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
			this.content = Bindable.make([]);
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

	slice(kFirst, kLast)
	{
		return [];
	}
}
