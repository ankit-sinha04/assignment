import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  
  title = 'app';
  invData;
  nameCmp;
  nameCont;
  cmpPer;
  cmpSts;
  orderForm: FormGroup;
  cmpDtls: FormGroup;
  testObject = new Object();
  items;
  formData = [];
  chart;
  numOfBars:5;
  y_clicked = null; //holds y-axis .getValueForPixel() when chart is clicked
  timeoutID = null; //handle to setTimeout
  @ViewChild('canvas') canvas;

  constructor(private formBuilder: FormBuilder) { }
  
  
  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      customerName: '',
      email: '',
      items: this.formBuilder.array([ this.createItem() ]),
      //formData: this.formBuilder.array([ this.companyData() ])
    });
  }

/* ngAfterViewInit(){ //instantiates the chart
    this.chart = new Chart(
      this.canvas.nativeElement.getContext("2d"),
      { //gets random data with which to fill the chart
        //let numOfBars = Math.floor(Math.random()*5 + 4); //4 to 8 horizontal bars
        type : 'bar',
        data : {
          labels: ['infosys', 'Accenture', 'TCS', 'EY', 'Delloite', 'PWC'],
          datasets:[{
            label: 'Dataset 1',
            borderWidth: 1,
            backgroundColor:"pink",
            data: [100,120,140,190,134,167]
          }
        /*  , 
          {
            label: 'Dataset 2',
            borderWidth: 1,
            backgroundColor:"cyan",
            data: [
              2, 4, 250, 300
            ]
          }
        ],
        },
        options: {
          responsive: true,
          legend:{display:false},
          onClick:(clickEvt,activeElems)=>this.onChartClick(clickEvt,activeElems),
        },
        title: {
          display: true,
          text: 'Company Data'
        }
      }
    );
  }*/

  rebuildChart(){ //changes data and .updates() chart
    this.chart.config = this.getChartConfig();
    this.chart.update();
  }
  getChartConfig(){
    this.chart = new Chart(
      this.canvas.nativeElement.getContext("2d"),
      {
        type : 'bar',
        data : {
          labels: this.getCompanyName(this.formData),//['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets:[{
            label: this.getCompanyName(this.formData),
            borderWidth: 1,
            backgroundColor:"pink",
            data: this.getCompanyPerformance(this.formData)//[this.formData[5].performance]
          }
          ,
          /*{
            label: 'Dataset 2',
            borderWidth: 1,
            backgroundColor:"cyan",
            data: this.getCompanyPerformance(this.formData)
          }*/
        ],
        },
        options: {
          responsive: true,
          legend:{display:false},
          onClick:(clickEvt,activeElems)=>this.onChartClick(clickEvt,activeElems),
          scales: {
            yAxes: [{
                     display: true,
                     stacked: true,
                     ticks: {
                         min: 0 // minimum value
                    
                     }
            }]
         }
        },
        title: {
          display: true,
          text: 'Company Data'
        }
      }
    );
    
  }

  randomData(count:number){ //gets array of specified length filled with random #s
    let results = [];
    for(let i=1; i <= +count; i++){
      //some values should be 0. The rest random.
      results.push([i,Math.random()<0.5 ? 0 : Math.random()])
    }
    return results;
  }

  onChartClick(clickEvt:MouseEvent,activeElems:Array<any>){
    //if click was on a bar, we don't care (we want clicks on labels)
    if(activeElems && activeElems.length) return;
    
    let mousePoint = Chart.helpers.getRelativePosition(clickEvt, this.chart.chart);
    let clickY = this.chart.scales['y-axis-0'].getValueForPixel(mousePoint.y);
    this.y_clicked = clickY;
    if(this.timeoutID) clearTimeout(this.timeoutID); //cancel any running timer
    this.timeoutID = setTimeout(()=>this.y_clicked=null,2000); //clear the value
  }

  addItem(cmpName, contPersn, perfrmnc, status): void {
    this.nameCmp = cmpName;
    this.nameCont = contPersn;
    this.cmpPer = perfrmnc;
    this.cmpSts = status;
   this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem());
   //alert(contPersn);
    //this.formData = this.cmpDtls.get('formData') as FormArray;
    
    this.invData = new Greeter(cmpName, contPersn, perfrmnc, status);
    

    /*this.testObject.cmpName = cmpName;
    this.testObject.contPersn = contPersn;
    this.testObject.perfrmnc = perfrmnc;
    this.testObject.status = status;*/
     //this.node.push(node);
      //this.formData.push("name",cmpName;"contPersn",contPersn);
      this.formData.push(this.invData);
     // this.getChartConfig();
      this.rebuildChart();
      //this.rebuildChart();
      //this.formData.push(perfrmnc);
      //this.formData.push(status);
    //alert(this.formData);
  }

  removeItems(i : number) : void
  {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.removeAt(i);
    this.formData.pop();
    this.rebuildChart();
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      name: '',
      description: '',
      price: ''
    });
  }
  companyData(): FormGroup {
    return this.formBuilder.group({
      CmpName: ''
    });
  }

  getCompanyName(nameData) 
  {
    var testdata=[];
    for(let i=0; i<nameData.length; i++){
         testdata[i] = nameData[i].comPanyName;
    }
    return testdata;
  }

  getCompanyPerformance(PerformanceData) 
  {
    var PerformData=[];
    for(let i=0; i<PerformanceData.length; i++){
      PerformData[i] = PerformanceData[i].performance;
    }
    return PerformData;
  }





 /* public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales : {
      xAxes : [{
          gridLines: {
              offsetGridLines : true
          }
      }]
  }
  };
  //public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartLabels:string[] = [];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Price'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Quantity'}
  ];
 
  
  public randomize():void {
   
    let data = [
      Math.round(Math.random() * 100),
      1000,
      500,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = this.barChartLabels ;
    clone[1].data = data ;
    this.barChartData = clone;
   
  }

  showGraph(year1, year2) {
    //this.barChartLabels = [];
    this.randomize();
  
    let j=0;
    
    for(let i = year1; i < year2; i++){
      
      //this.barChartData[j++]=i;
    this.barChartLabels[j] = i;
    j++;
    
    
    }
  
  }


  

  public pieChartLabels:string[] = ['price', 'quantity', 'device type'];
  public pieChartData:number[] = [300, 500, 100];
  public pieChartType:string = 'pie';
*/
}

export interface IConmapnyData {
  comPanyName: string;
  contactPerson: string;
  performance: number;
  status: string;
  node: Array<IConmapnyData>;
}

export class Greeter {
  comPanyName: string;
  contactPerson: string;
  performance: number;
  status: string;

  constructor(comPanyName: string,
    contactPerson: string,
    performance: number,
    status: string) {
      this.comPanyName = comPanyName;
      this.contactPerson = contactPerson;
      this.performance = performance;
      this.status = status;
  }
  dataList() {
      return  [this.comPanyName, this.contactPerson, this.performance, this.status];
  }
}



