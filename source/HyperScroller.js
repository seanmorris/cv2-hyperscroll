import { rawquire } from 'rawquire/rawquire.macro';

import { View as BaseView } from 'curvature/base/View';
import { Mixin } from 'curvature/base/Mixin';

import { Tag } from 'curvature/base/Tag';

import { GeoIn      } from 'curvature/animate/ease/GeoIn';
import { GeoOut     } from 'curvature/animate/ease/GeoOut';
import { ElasticOut } from 'curvature/animate/ease/ElasticOut';

import { Row } from './Row';

export class HyperScroller extends Mixin.from(BaseView)
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template = rawquire('./hyper-scroller.html');

		this.preRuleSet.add('[cv-ref="list"]', ({element}) => {
			element.setAttribute('tabindex', -1);
			element.setAttribute('cv-each', 'visible:row:r');
			element.setAttribute('cv-view', 'cv2-hyperscroll/Row');
		});

		this.args.visible   = [];
		this.args.content   = undefined;

		this.first          = null;
		this.last           = null;

		this.changing       = false;
		this.lastScroll     = false;
		this.topSpeed       = 0;
		this.speed          = 0;

		this.args.width     = '100%';
		this.args.height    = '100%';
		this.args.scrollTop = 0;
		this.args.scrollDir = 0;

		this.args.snapOffset = 0;

		this.args.rowHeight = this.args.rowHeight || 32;

		this.args.bindTo('scrollTop', (v,k,t) => {
			this.args.scrollDir = 0;

			if(v > t[k])
			{
				this.args.scrollDir = 1;
			}
			else if(v < t[k])
			{
				this.args.scrollDir = -1;
			}
		});
	}

	onRendered()
	{
		const container = this.container = this.tags.list;
		const scroller  = this.scroller  = (this.tags.scroller || container);
		const shim = new Tag('<div data-tag = "shim">');

		scroller.style({
			overflowY:  'scroll'
			, position: 'relative'
			, display:  'block'
			, width:    '100%'
		});

		shim.style({
			pointerEvents: 'none'
			, position:    'absolute'
			, opacity:     0
			, height:      'var(--shimHeight)'
			, width:       '1px'
		});

		this.listen(scroller.node, 'scroll', event => this.updateViewport(event));

		this.args.bindTo('snapOffset', v => container.style({'--snapperOffset': `${-1*v}px`}), {wait: 0});
		this.args.bindTo('snapOffset', v => container.style({'--snapperOffset': `${-1*v}px`}), {wait: 0});

		scroller.append(shim.element);

		const setHeights = (v,k) => scroller.style({[`--${k}`]: `${v}px`});

		this.args.bindTo('height', v => container.style({height: v}));
		this.args.bindTo('width', v => container.style({width: v}));

		this.args.bindTo('rowHeight', setHeights);
		this.args.bindTo('shimHeight', setHeights);

		this.args.bindTo('rowHeight', (v,k,t) => {

			const headers = this.header && this.header();

			const headerRow = headers ? -1 : 0;

			t[k] = parseInt(v);

			const rows = headerRow + this.args.content ? this.args.content.length : 0;

			this.args.shimHeight = rows * this.args.rowHeight;

			this.scroller.scrollTop = this.first * this.args.rowHeight;

			this.onNextFrame(() => this.updateViewport());
		});

		this.contentDebind = this.args.bindTo('content', (v,k,t) => {

			const headers = this.header && this.header();

			const headerRow = headers ? 1 : 0;

			const rows = headerRow + v ? v.length : 0;

			this.args.shimHeight = rows * this.args.rowHeight;

			this.lengthDebind && this.lengthDebind();

			if(v)
			{
				this.lengthDebind = v.bindTo('length', v => {

					const headers = this.header && this.header();

					v = Number(v);

					this.updateViewport();

					this.args.shimHeight = v * this.args.rowHeight;

					if(this.args.changedScroll)
					{
						this.container.scrollTo({
							behavior: 'smooth'
							, top: this.container.scrollHeight,
						});
					}

				}, {wait: 0});
			}
			else
			{
				this.updateViewport();
			}
		}, {wait: 0});

		this.updateViewport();

		this.container.scrollTo({top:this.container.scrollHeight});
	}

	updateViewport(event)
	{
		const container = this.container;
		const scroller  = this.scroller || container;

		if(this.changing)
		{
			return;
		}

		this.snapper && this.snapper.cancel();

		const headers   = this.header && this.header();

		const start = this.args.scrollTop    = scroller.scrollTop;
		const depth = this.args.scrollHeight = scroller.scrollHeight;
		const space = container.offsetHeight;
		const fold  = start + space;

		scroller.style({'--scrollTop': start});

		this.args.scrollMax = depth - space;

		let first = Math.floor(start / this.args.rowHeight);
		let last  = Math.ceil(fold / this.args.rowHeight);

		const lastScroll = {time: Date.now(), pos: start};

		if(!this.speedTimer)
		{
			this.speedTimer = this.onTimeout(100, ()=>{
				const timeDiff = Date.now() - lastScroll.time
				const posDiff  = scroller.scrollTop - start;

				this.speed = (posDiff / timeDiff) * 1000;

				const absSpeed = Math.abs(this.speed);

				if(absSpeed > Math.abs(this.topSpeed))
				{
					this.topSpeed = this.speed;
				}

				if(!this.speed)
				{
					this.topSpeed = this.speed;
				}

				this.args.speed = this.speed.toFixed(2);
			});

			this.speedTimer = false;
		}

		if(!this.args.content && !Array.isArray(this.args.content))
		{
			return;
		}

		container.style({'--hasHeaders': Number(!!headers)});

		if(first > this.args.content.length)
		{
			first = this.args.content.length - 1;
		}

		if(last > this.args.content.length)
		{
			last = this.args.content.length - 1;
		}

		this.setVisible(first, last);

		if(start === 0 || fold === depth)
		{
			container.style({'--inertiaOffset': `0px`});
			container.style({'--snapperOffset': `0px`});
			this.args.snapOffset = 0;

			this.snapperDone && this.snapperDone();
			return;
		}

		if(!event)
		{
			return;
		}

		const closeRow = Math.round(start / this.args.rowHeight);
		const groove   = closeRow * this.args.rowHeight;
		const diff     = groove - start;

		let duration = Math.abs(diff * this.args.rowHeight);

		if(duration > 512)
		{
			duration = 512;
		}

		const snapper = Math.abs(diff) > Math.min(10, (this.args.rowHeight/3))
			? new ElasticOut(duration*3, {friction: 0.15})
			: new GeoOut(diff*3, {power: 5});

		this.snapperDone && this.snapperDone();

		this.snapperDone = this.onFrame(()=>{
			const offset = snapper.current() * diff;
			this.args.snapOffset = offset;
		});

		snapper.then(elapsed => {
			if(this.args.snapOffset == 0)
			{
				return;
			}

			if(scroller.scrollTop !== groove)
			{
				scroller.scrollTop = groove;
			}

			this.args.snapOffset = 0;

			this.snapperDone && this.snapperDone();

			event.preventDefault();

		}).catch(elapsed => {

			// const offset = this.snapper.current() * diff;

			// this.args.snapOffset = 0;

		});

		this.scrollFrame && cancelAnimationFrame(this.scrollFrame);

		this.scrollFrame = requestAnimationFrame(()=> snapper.start());

		this.snapper = snapper;
	}

	setVisible(first, last)
	{
		if(this.changing)
		{
			// cancelAnimationFrame(this.changing);
			// this.changing = false;
			return;
		}

		if(this.first === first && this.last === last)
		{
			return;
		}

		if(!this.tags.list)
		{
			return;
		}

		const listTag     = this.tags.list;
		const visibleList = this.viewLists.get(listTag.node);

		if(!visibleList)
		{
			return;
		}

		const visible = visibleList.views;

		const del = [];

		if(first <= last)
		{
			for(const i in visible)
			{
				const index = parseInt(i);
				const entry = visible[index];

				if(first === last && last === 0)
				{
					del.unshift(index);
					continue;
				}

				if(index < first || index > last)
				{
					del.unshift(index);
					continue;
				}

				if(entry && (!entry.visible || entry.removed))
				{
					del.unshift(index);
					continue;
				}
			}
		}
		else
		{
			visible.map((v,k) => del.push(k));
		}

		for(const d of del)
		{
			if(d === 0 && this.header())
			{
				continue;
			}

			visible[d] && visible[d].remove();

			delete visible[d];
			delete this.args.visible[d];
		}

		for(let i = first; i <= last; i++)
		{
			if(this.args.content.length <= i)
			{
				continue;
			}

			this.args.visible[i] = this.args.content[i];
		};

		this.first = first;
		this.last  = last;

		this.changing = false;
	}

	header()
	{
		if(!this.args.content)
		{
			return false;
		}

		if(Array.isArray(this.args.content))
		{
			return false;
		}

		if(typeof this.args.content.header !== 'function')
		{
			return false;
		}

		return this.args.content.header();
	}

	leftPad(x)
	{
		return String(x).padStart(4,0);
	}
}
