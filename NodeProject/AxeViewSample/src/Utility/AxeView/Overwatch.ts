import { OverwatchInterface } from "./OverwatchInterface";
import { AxeViewDomInterface, AxeViewDomType } from "./AxeViewDomInterface";
import { OverwatchingOutputType, OverwatchingType } from "./OverwatchingType";

/** 감시 대상  */
export class Overwatch
{
	constructor(target: OverwatchInterface)
	{
		this.Name = target.Name;
		this.NameFindString = "{{" + this.Name + "}}";


		if ("" === target.FirstData
			|| " " === target.FirstData)
		{
			if (OverwatchingOutputType.String === this.OverwatchingOutputType)
			{
				//이 값은 절대 비어있으면 안된다.(빈값을 쓰려면 스페이스를 사용하자)
				//빈값으로는 노드를 생성하지 않고 있기 때문이다.
				this._DataNow = " ";
			}
			else if (OverwatchingOutputType.Html === this.OverwatchingOutputType)
			{
				//데이터가 html인경우 빈값을 넣으면 안되고 보이지 않는 요소라라도 하나 넣어야 한다.
				//(<div></div>)
				//안그러면 text 노드가 생성되서 에러가 난다.
				//그래서 여기서 넣어준다.
				this._DataNow = "<div></div>";
			}
		}
		else
		{
			this._DataNow = target.FirstData;
		}


		this.OverwatchingOutputType = target.OverwatchingOutputType;
		this.OverwatchingType = target.OverwatchingType;
		this.OverwatchingOneIs = target.OverwatchingOneIs;
	}

	/** 
	 *  액스뷰에서 지정한 고유번호.
	 *  액스뷰를 바인딩할때 자동으로 입력된다.
	 *  이 값이 중복되면 교체(Replace)가 잘 안될 수 있다.
	 * */
	public MyNumber: number = 0;

	/**
	 * 찾을 이름
	 * OverwatchInterface.Name 참조
	 * */
	public Name: string = "";
	/** 이름 검색용 문자열
	 * 자동생성된다.*/
	public NameFindString: string = "";

	/** 지금 가지고 있는 데이터 */
	private _DataNow: string | Function | HTMLElement = "";
	/** 현재가지고 있는 값을 임의로 수정 */
	public set DataNow(dataNow: string | Function | HTMLElement)
	{
		this._DataNow = dataNow;
	}

	/** 
	 *  지금 가지고 있는 데이터 - Replace
	 *  교체(Replace)의 경우 이전값이 빈값이면 동작할 수 없으므로
	 *  임의의 고유값을 생성하여 저장하는 변수다.
	 * */
	private _DataNow_ReplaceValue: string = "";

	/** 임시로 들고 있어야할 데이터가 있을때 사용하는 속성 */
	public Temp?: any = null;

	/**
	 * 실제 동작 get
	 */
	private DataNowGet: Function = (): string | Function | HTMLElement =>
	{
		let sReturn: string | Function | HTMLElement = "";

		if (true === this.DomIsOri)
		{//돔 개체 전용
			sReturn = this._DataNow;
		}
		else if (true === this.ValueMonitoringIs)
		{//값 모니터링 전용

			if (0 < this._Dom_AxeView.length)
			{
				//값 모니터링은 돔의 value를 우선한다.
				sReturn = (this._Dom_AxeView[0].Dom as Attr).value;
			}
		}
		else
		{
			sReturn = this._DataNow;
		}
		return sReturn;
	};
	/**
	 * 실제 동작 set
	 * @param data
	 */
	private DataNowSet: Function = function (data: any)
	{
		//기존값 백업
		let OldData: any = this._DataNow;
		let OldReplaceValue: string = this._DataNow_ReplaceValue;

		//새값 저장
		this._DataNow = data;

		if (null !== this._Dom_AxeView
			&& 0 < this._Dom_AxeView.length)
		{//돔이 있으면 실행

			//저장된 돔개수만큼 실행
			for (let nDomIdx: number = 0; nDomIdx < this._Dom_AxeView.length; ++nDomIdx)
			{
				let item: AxeViewDomInterface = this.Dom_AxeView[nDomIdx];
				//item.innerHTML = this._DataNow;
				if (AxeViewDomType.Node === item.AxeViewDomType)
				{
					(item.Dom as Node).nodeValue = this._DataNow;
				}
				else if (AxeViewDomType.Dom === item.AxeViewDomType)
				{//돔인 경우

					//돔은 교체만 허용한다.
					if (true === (this._DataNow instanceof HTMLElement))
					{//들어온 값이 HTMLElement다.

						//돔의 경우 이전 개체(OldData)의 부모를 찾아
						//.replaceChild를 해야 한다.
						(OldData.parentElement as HTMLElement)
							.replaceChild(this._DataNow, OldData);
					}

				}
				else if (AxeViewDomType.Attr_OneValue === item.AxeViewDomType
					|| AxeViewDomType.Attr_ValueMonitoring === item.AxeViewDomType)
				{
					(item.Dom as Attr).value = this._DataNow;
				}
				else if (AxeViewDomType.Attr_ReplaceValue === item.AxeViewDomType)
				{
					let attrTemp: Attr = item.Dom as Attr;

					//벨류의 경우 대소문자 구분이 가능하므로 소문자 변환을 하면 안된다.
					//속성을 교체하는 방식인 경우 빈값이 들어오면 교체하지 못하므로
					//임의의 고유값을 생성하여 저장한다.



					//이전 데이터를 백업하고
					let OldDataTemp: string = OldReplaceValue;
					if ("" === OldDataTemp)
					{
						OldDataTemp = OldData;
					}

					//현재 데이터 저장
					this._DataNow_ReplaceValue = this._DataNow;

					if ("" === this._DataNow_ReplaceValue)
					{//현재 데이터가 비어있다.

						//임의의 값을 생성해 준다.
						this._DataNow_ReplaceValue
							= OldData + "_AxeViewTemp" + this.MyNumber;
					}

					if (true === this.OverwatchingOneIs)
					{//한개만 교체
						attrTemp.value
							= attrTemp.value.replace(
								OldDataTemp
								, this._DataNow_ReplaceValue);
					}
					else
					{//전체 교체
						attrTemp.value
							= this.ReplaceAll(
								attrTemp.value
								, OldDataTemp
								, this._DataNow_ReplaceValue);
					}
				}
				else if (AxeViewDomType.Attr_Valueless === item.AxeViewDomType)
				{
					//값이 없는 값은 속성자체를 바꿔야 한다.
					let elemTemp: HTMLElement = (item.Dom as HTMLElement);
					//기존 이름 제거
					elemTemp.removeAttribute(OldData.toLowerCase());
					//새 이름 추가(값없음)
					elemTemp.setAttribute(this._DataNow, "");
				}
				else if (AxeViewDomType.Attr_Event === item.AxeViewDomType)
				{
					//기존에 연결된 이벤트 제거
					(item.Dom as Node).removeEventListener(item.EventName, item.Event);

					//새로들어온 이벤트 연결
					item.Event = data;
					(item.Dom as Node).addEventListener(item.EventName, item.Event);
				}
				else
				{
					if (true === (data instanceof Element)
						|| true === (data instanceof HTMLElement)
						//|| true === (data instanceof ChildNode)
						|| true === (data instanceof Node))
					{
						(item.Dom as HTMLElement).innerHTML = "";
						(item.Dom as HTMLElement)
							.insertAdjacentElement("beforeend", data);
					}
					else
					{
						(item.Dom as HTMLElement).innerHTML = data;
					}


				}
			}

		}
	};

	/** 
	 * 출력 방식
	 * OverwatchInterface.OverwatchingOutputType 참고
	 * */
	public OverwatchingOutputType: OverwatchingOutputType;
	/** 
	 *  감시 방식
	 *  OverwatchInterface.OverwatchingType 참고
	 * */
	public OverwatchingType: OverwatchingType;
	/** 
	 * 한개만 감시할지 여부 
	 * OverwatchInterface.OverwatchingOneIs 참고
	 */
	public OverwatchingOneIs: boolean = false;;

	/** 
	 * 연결되있는 액스돔 리스트
	 * 단순 출력의 경우 추가하지 않는다.
	 * 여러개가 연결된 경우 각각의 돔이들어있게 된다.
	 * 'Action'이 어트리뷰트에 연결된 경우 대상 dom이 저장되고,
	 * innerText영역에 있는 경우 임의로 생성된 태그가 지정된다.
	 * 
	 * Dom 개체 형식의 경우 부모는 무조건 한개가 되므로 이 배열에 추가하지 않는다.
	 * (DataNow만 사용)
	 * */
	private _Dom_AxeView: AxeViewDomInterface[] = [];
	/** 연결된 돔 */
	public get Dom_AxeView(): AxeViewDomInterface[]
	{
		return this._Dom_AxeView;
	}

	/** 연결된 돔 리스트에서 가장 첫 액스돔이 가지고 있는 돔 */
	public get Dom(): HTMLElement | Node | Attr | Function
	{
		return this.Dom_AxeView[0].Dom;
	}


	/** 연결된 돔 비우기 */
	public Dom_Clear()
	{
		this._Dom_AxeView = [];
	}

	/** 
	 * 모니터링 중인 데이터 - 읽기
	 * Action을 읽어 리턴한다.
	 * UI가 갱신되지 않았다면 UI와 다른 값일 수 있다.
	 * */
	public get data()
	{
		return this.DataNowGet();
	}
	/** 
	 *  모니터링 중인 데이터 - 쓰기 
	 *  Action에 데이터를 저장한다.
	 *  설정된 'OverwatchingType'에 따라 화면 갱신이 있을 수 있다.
	 */
	public set data(value: any)
	{
		this.DataNowSet(value);
	}
	/** 지금 가지고 있는 데이터를 다시 출력시도한다.
	 * dom이 새로 설정됐다면 꼭 호출해야 한다.*/
	public DataRefresh()
	{
		this.data = this.data;
	}



	/** 'OverwatchingType'가 한번만 적중해야 하는 옵션인경우 
	 * 맨처음 적중하면 true가 된다.*/
	public OneDataIs: boolean = false;

	/** 값 모니터링 전용인지 여부 - 원본 */
	private ValueMonitoringIsOri: boolean = false;
	/** 값 모니터링 전용인지 여부 */
	public get ValueMonitoringIs(): boolean { return this.ValueMonitoringIsOri; }
	/** 값 모니터링 전용인지 여부 */
	public set ValueMonitoringIs(value: boolean) { this.ValueMonitoringIsOri = value; }

	/** 돔 개체 전용인지 여부 - 원본 */
	private DomIsOri: boolean = false;
	/** 돔 개체 전용인지 여부 */
	public get DomIs(): boolean { return this.DomIsOri; }
	/** 돔 개체 전용인지 여부 */
	public set DomIs(value: boolean) { this.DomIsOri = value; }




	/**
	 * 지정한 문자열을 모두 찾아 변환한다.
	 * @param sOriData 원본
	 * @param sSearch 찾을 문자열
	 * @param sReplacement 바꿀 문자열
	 * @returns 완성된 결과
	 */
	private ReplaceAll(sOriData: string, sSearch: string, sReplacement: string): string
	{
		return sOriData.replace(new RegExp(sSearch, 'g'), sReplacement);
	}

}

