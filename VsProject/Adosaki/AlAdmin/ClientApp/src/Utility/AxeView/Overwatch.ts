import { OverwatchInterface, OverwatchTossOptions } from "./OverwatchInterface";
import { AxeViewDomInterface, AxeViewDomType } from "./AxeViewDomInterface";
import { OverwatchingOutputType, OverwatchingType } from "./OverwatchingType"

/** 감시 대상  */
export class Overwatch
{
	constructor(target: OverwatchInterface)
	{
		this.Name = target.Name;
		this.NameFindStringOri =
			new RegExp(`\{\{${this.Name}+\}\}|\{\{${this.Name}+@.*\}\}`, 'g');
		this.NameFindStringLowerCaseOri =
			new RegExp(`\{\{${this.Name.toLowerCase()}+\}\}|\{\{${this.Name.toLowerCase() }+@.*\}\}`, 'g');

		//전달 옵션
		if (undefined !== target.TossOption
			&& null !== target.TossOption)
		{//있을때만 전달
			this.TossOption = target.TossOption;
		}

		if (undefined !== target.AxeDomSet_DataEdit
			&& null !== target.AxeDomSet_DataEdit)
		{//있을때만 전달
			this.AxeDomSet_DataEdit = target.AxeDomSet_DataEdit;
		}




		if ("" === target.FirstData
			|| " " === target.FirstData)
		{
			if (OverwatchingOutputType.Dom === this.OverwatchingOutputType)
			{
				//빈값은 돔인경우만 허용된다.
				this._DataNow = "";
			}
			else if (OverwatchingOutputType.String === this.OverwatchingOutputType)
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

	/** 이름 검색용 문자열 - 원본
	 * 자동생성된다.*/
	private NameFindStringOri: RegExp;
	/** 이름 검색용 문자열
	 * 자동생성된다.*/
	public get NameFindString(): RegExp
	{
		return this.NameFindStringOri;
	}

	/** 이름 검색용 문자열(소문자) - 원본
	 * 자동생성된다.*/
	private NameFindStringLowerCaseOri: RegExp;
	/** 이름 검색용 문자열(소문자)
	 * 자동생성된다.*/
	public get NameFindStringLowerCase(): RegExp
	{
		return this.NameFindStringLowerCaseOri;
	}



	/** 
	 * 기본값으로 사용할 전달 옵션
	 * 뷰단에서 넘어오는 옵션은 이 옵션과 합쳐서 사용한다.
	 * 뷰에서 넘어온 옵션이 우선이다.
	 */
	public TossOption: { [key: string]: string } = {};

	public TossOptionFirst<T>():T
	{
		return this.Dom_AxeViewList[0].TossOption as T;
	}


	/** 지금 가지고 있는 데이터 */
	private _DataNow: string | Function | HTMLElement = "";
	/** 현재가지고 있는 값을 임의로 수정 */
	public set DataNow(dataNow: string | Function | HTMLElement)
	{
		this._DataNow = dataNow;
	}

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
			
			if (0 < this.Dom_AxeViewListOri.length)
			{
				//값 모니터링은 돔의 value를 우선한다.
				sReturn = (this.Dom_AxeViewListOri[0].Dom as Attr).value;
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
		

		//새값 저장
		this._DataNow = data;
		//저장된 새값 사용
		let DataNowThis = this._DataNow;

		
		if (null !== this.Dom_AxeViewListOri
			&& 0 < this.Dom_AxeViewListOri.length)
		{//돔이 있으면 실행

			//저장된 돔개수만큼 실행
			for (let nDomIdx: number = 0; nDomIdx < this.Dom_AxeViewListOri.length; ++nDomIdx)
			{
				let item: AxeViewDomInterface = this.Dom_AxeViewList[nDomIdx];

				//화면에 표시한 데이터 백업
				let OldDataView: string | null = item.DataView;
				//화면 표시용 데이터
				let ViewData = this.AxeDomSet_DataEdit(this, item, DataNowThis);

				
				if (AxeViewDomType.Node === item.AxeViewDomType)
				{
					//(item.Dom as Node).nodeValue = DataNowThis;
					(item.Dom as Node).nodeValue = ViewData;
				}
				else if (AxeViewDomType.Dom === item.AxeViewDomType)
				{//돔인 경우

					//돔은 교체만 허용한다.
					if (true === (DataNowThis instanceof HTMLElement))
					{//들어온 값이 HTMLElement다.

						//돔의 경우 이전 개체(OldData)의 부모를 찾아
						//.replaceChild를 해야 한다.
						(OldData.parentElement as HTMLElement)
							.replaceChild(DataNowThis, OldData);
					}
					
				}
				else if (AxeViewDomType.Attr_OneValue === item.AxeViewDomType
					|| AxeViewDomType.Attr_ValueMonitoring === item.AxeViewDomType				)
				{
					(item.Dom as Attr).value = ViewData;
				}
				else if (AxeViewDomType.Attr_ReplaceValue === item.AxeViewDomType)
				{
					let attrTemp: Attr = item.Dom as Attr;

					//벨류의 경우 대소문자 구분이 가능하므로 소문자 변환을 하면 안된다.
					//속성을 교체하는 방식인 경우 빈값이 들어오면 교체하지 못하므로
					//임의의 고유값을 생성하여 저장한다.

					

					//이전 데이터를 백업하고
					let OldDataTemp: string = item.DataView;
					if ("" === OldDataTemp)
					{
						OldDataTemp = OldData;
					}

					//현재 데이터 저장
					item.DataView = ViewData;
					
					if ("" === item.DataView)
					{//현재 데이터가 비어있다.

						//임의의 값을 생성해 준다.
						item.DataView
							= OldData + "_AxeViewTemp" + this.MyNumber;
					}

					if (true === this.OverwatchingOneIs)
					{//한개만 교체
						attrTemp.value
							= attrTemp.value.replace(
								OldDataTemp
								, item.DataView);
					}
					else
					{//전체 교체
						attrTemp.value
							= this.ReplaceAll(
								attrTemp.value
								, OldDataTemp
								, item.DataView);
					}
				}
				else if (AxeViewDomType.Attr_Valueless === item.AxeViewDomType)
				{
					//값이 없는 값은 속성자체를 바꿔야 한다.
					let elemTemp: HTMLElement = (item.Dom as HTMLElement);
					//기존 이름 제거
					elemTemp.removeAttribute(OldData.toLowerCase());
					//새 이름 추가(값없음)
					elemTemp.setAttribute(ViewData, "");
				}
				else if (AxeViewDomType.Attr_Event === item.AxeViewDomType)
				{
					//기존에 연결된 이벤트 제거
					(item.Dom as Node).removeEventListener(item.EventName, item.Event);

					//새로들어온 이벤트 연결
					item.Event = DataNowThis;
					(item.Dom as Node).addEventListener(item.EventName, item.Event);
				}
				else
				{
					if (true === (DataNowThis instanceof Element)
						|| true === (DataNowThis instanceof HTMLElement)
						//|| true === (data instanceof ChildNode)
						|| true === (DataNowThis instanceof Node))
					{//들어온 데이터가 개체 타입이다.
						(item.Dom as HTMLElement).innerHTML = "";
						(item.Dom as HTMLElement)
							.insertAdjacentElement("beforeend", DataNowThis);
					}
					else
					{//html string 이다.

						(item.Dom as HTMLElement).innerHTML = ViewData;
					}
					
					
				}
			}//end for nDomIdx
			
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
	private Dom_AxeViewListOri: AxeViewDomInterface[] = [];
	/** 연결된 돔 */
	public get Dom_AxeViewList(): AxeViewDomInterface[]
	{
		return this.Dom_AxeViewListOri;
	}

	/** 연결된 돔 리스트에서 가장 첫 액스돔이 가지고 있는 돔 */
	public get Dom(): HTMLElement | Node | Attr | Function
	{
		return this.Dom_AxeViewList[0].Dom;
	}


	/** 연결된 돔 비우기 */
	public Dom_Clear()
	{
		this.Dom_AxeViewListOri = [];
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
	 * Set동작이 시작되어 데어를 화면에 표시하기 직전에 호출되는 함수
	 * 
	 * 이 이벤트는 연결된 개체의 개수만큼 호출된다.
	 * @param owThis 이 이벤트가 발생한 감시대상
	 * @param adThis 이 이벤트를 호출한 액스돔 개체
	 * @param data 전달된 값
	 * @returns 출력값이 문자열인경우 문자열을 직접 조작하려는 리턴값. 문자열이 아닌경우 빈값을 리턴하는것이 좋다.
	 */
	public AxeDomSet_DataEdit
		= (owThis: Overwatch, adThis: AxeViewDomInterface, data: any): string => { return data; }

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

