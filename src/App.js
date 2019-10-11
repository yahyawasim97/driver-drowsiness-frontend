import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Axios from 'axios';
import socketIOClient from "socket.io-client";
import ReactApexChart from 'react-apexcharts';
import ApexChart from 'apexcharts';
import {Row,Col,Container,Button,Navbar,NavbarBrand,Nav,NavItem,NavLink,Spinner} from 'reactstrap';
var alphaChartData = [];
var betaChartData=[];
var thetaChartData=[];
var gammaChartData=[];
let XAXISRANGE = 14000


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentState:false,
      loading:false,
      alphaOptions: {
        chart: {
            id: 'realtimealpha',
            animations: {
              enabled: true,
              easing: 'timing',
              dynamicAnimation: {
                speed: 10000
              }
            },
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width:2
          },
          title: {
            text: 'Alpha',
            align: 'left'
          },
          markers: {
            size: 0
          },
          xaxis: {
            type: 'datetime',
            range: XAXISRANGE,
          },
          yaxis: {max:12,min:8},
          legend: {
            show: false
          }
      },
      alphaSeries: [{
        name:'Alpha',
        data: alphaChartData.slice()
      }
      ],


      betaOptions: {
        chart: {
            id: 'realtimebeta',
            animations: {
              enabled: true,
              easing: 'timing',
              dynamicAnimation: {
                speed: 10000
              }
            },
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            color:'white',
            width:2
          },

          title: {
            text: 'Beta',
            align: 'left'
          },
          markers: {
            size: 0
          },
          xaxis: {
            type: 'datetime',
            range: XAXISRANGE,
          },
          yaxis: {max:30,min:12},
          legend: {
            show: false
          }
      },
      betaSeries: [{
        name:'Beta',
        data: betaChartData.slice()
      }
      ],



      gammaOptions: {
        chart: {
            id: 'realtimegamma',
            animations: {
              enabled: true,
              easing: 'timing',
              dynamicAnimation: {
                speed: 10000
              }
            },
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            color:'white',
            width:2
          },

          title: {
            text: 'Gamma',
            align: 'left'
          },
          markers: {
            size: 0
          },
          xaxis: {
            type: 'datetime',
            range: XAXISRANGE,
          },
          yaxis: {max:100,min:30},
          legend: {
            show: false
          }
      },
      gammaSeries: [{
        name:'Gamma',
        data: gammaChartData.slice()
      }
      ],


      thetaOptions: {
        chart: {
            id: 'realtimetheta',
            animations: {
              enabled: true,
              easing: 'timing',
              dynamicAnimation: {
                speed: 10000
              }
            },
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            color:'white',
            width:2
          },

          title: {
            text: 'Theta',
            align: 'left'
          },
          markers: {
            size: 0
          },
          xaxis: {
            type: 'datetime',
            range: XAXISRANGE,
          },
          yaxis: {max:8,min:4},
          legend: {
            show: false
          }
      },
      thetaSeries: [{
        name:'Theta',
        data: thetaChartData.slice()
      }
      ],

    }
  }

  componentDidMount=async()=>{

    const socket = socketIOClient('http://localhost:8000');
    socket.on("powData", data => {
      this.setState({
        loading:false
      })
      alphaChartData.push({
          x:new Date(), y:data.alpha.toFixed(2)
      });
      betaChartData.push({
        x:new Date(), y:data.beta.toFixed(2)
      });
      gammaChartData.push({
        x:new Date(), y:data.gamma.toFixed(2)
      });
      thetaChartData.push({
        x:new Date(), y:data.theta.toFixed(2)
      });
      ApexChart.exec('realtimebeta', 'updateSeries', [{
        data: betaChartData
      }]);
      ApexChart.exec('realtimealpha', 'updateSeries', [{
        data: alphaChartData
      }]);
      ApexChart.exec('realtimegamma', 'updateSeries', [{
        data: gammaChartData
      }]);
      ApexChart.exec('realtimetheta', 'updateSeries', [{
        data:thetaChartData
      }]);
      }
    );
  }
  renderSocket=async()=>{
    try{
      let response = await Axios.get('http://localhost:8000/authorize');
      this.setState({
        currentState:!this.state.currentState,
        loading:true
      })
    }catch(e){
      console.log(e)
    }
  }

  unsubscribeSocket=async()=>{
    try{
      let response = await Axios.get('http://localhost:8000/unsub');
      this.setState({
        currentState:!this.state.currentState
      })
    }catch(e){
      console.log(e)
    }
  }
  render(){
  return (
    <div className="App" style={{backgroundColor:'#3a0e0e',minHeight:'100vh',overflow:'hidden'}}>
      <Navbar  dark expand="md" style={{backgroundColor:'black'}}>
      <NavbarBrand href="/"><img src='/logo.png'  style={{height:50,width:50,marginRight:10}}/>Driver Drowsiness Detection System</NavbarBrand>
      <Nav className="ml-auto" navbar>
        {this.state.loading?<Spinner/>:!this.state.currentState ?<NavItem>
          <NavLink onClick={this.renderSocket}><i class="fas fa-play-circle" style={{fontSize:40,color:'white'}}></i></NavLink>
        </NavItem>:
        <NavItem>
          <NavLink onClick={this.unsubscribeSocket}><i class="fas fa-stop-circle" style={{fontSize:40,color:'white'}}></i></NavLink>
        </NavItem>}
      </Nav>
      </Navbar>
      {/* <Row className="m-2" >      
        <Col md="6" style={{alignSelf:'flex-end'}}>

        <h2>Driver Drowsiness Detection</h2>
        </Col>
        <Col md="6" style={{alignItems:'flex-end',justifyContent:'flex-end'}}>

        <Button onClick={this.renderSocket} style={{marginRight:10}} >Hit it !</Button>
        <Button>Stop</Button>
        </Col>
      </Row> */}

      <Row className="justify-content-center " style={{marginTop:'5rem'}} >
        <Col md="4" style={{background:'black',marginRight:20,padding:15,borderRadius:20,border:'2px solid black',boxShadow:'0px 0px 10px 2px rgba(140,125,140,0.57)'}}>
          <ReactApexChart options={this.state.alphaOptions} series={this.state.alphaSeries} type="line" height="250" />
        </Col>
        <Col md="4" style={{background:'black',padding:15,marginLeft:20,borderRadius:20,border:'2px solid black',boxShadow:'0px 0px 10px 2px rgba(140,125,140,0.57)'}}>
          <ReactApexChart options={this.state.betaOptions} series={this.state.betaSeries} type="line" height="250" />
        </Col>
        
      </Row>
      <Row className="mt-4 justify-content-center" >
      <Col md="4" style={{background:'black',padding:15,marginRight:20,borderRadius:20,border:'2px solid black',boxShadow:'0px 0px 10px 2px rgba(140,125,140,0.57)'}}>
          <ReactApexChart options={this.state.gammaOptions} series={this.state.gammaSeries} type="line" height="250" />
        </Col>
        <Col md="4" style={{background:'black',padding:15,marginLeft:20,borderRadius:20,border:'2px solid black',boxShadow:'0px 0px 10px 2px rgba(140,125,140,0.57)'}}>
          <ReactApexChart options={this.state.thetaOptions} series={this.state.thetaSeries} type="line" height="250" />
        </Col>
      </Row> 
    </div>
  );
  }
}

export default App;
