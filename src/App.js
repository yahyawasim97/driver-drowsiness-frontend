import React,{Component,Fragment} from 'react';
import logo from './logo.svg';
import './App.css';
import Axios from 'axios';
import socketIOClient from "socket.io-client";
import ReactApexChart from 'react-apexcharts';
import ApexChart from 'apexcharts';
import {Row,Col,Container,Button,Navbar,NavbarBrand,Nav,NavItem,NavLink,Spinner,Modal,ModalFooter,ModalHeader,ModalBody,Label,FormGroup,Input,Table,Alert,Progress} from 'reactstrap';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'
var alphaChartData = [];
var betaChartData=[];
var thetaChartData=[];
var gammaChartData=[];
let XAXISRANGE = 14000


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      volume:true,
      drowsyState:false,
      modal2:false,
      modal3:false,
      means:null,
      bands:[],
      blinks:[],
      currentState:false,
      loading:false,
      minutes:0,
      blinkStatus:false,
      userId:'',
      name:'',
      value: {
        min: 0,
        max: 0,
      },
      modal:false,
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
  getMode(array){
    var counts = {};
    var compare = 0;
    var mostFrequent;
    for(var i = 0, len = array.length; i < len; i++){
        var word = array[i];
        
        if(counts[word] === undefined){
            counts[word] = 1;
        }else{
            counts[word] = counts[word] + 1;
        }
        if(counts[word] > compare){
              compare = counts[word];
              mostFrequent = array[i];
        }
    }
    return mostFrequent;
  }

  componentDidMount=async()=>{

    const socket = socketIOClient('http://localhost:8000');
    socket.on("blinkData", data => {
      let blinks = [...this.state.blinks];
      blinks.push(data);
      this.setState({
        blinks,
        loading:false
      })
    });
    socket.on('blink', data => {
      this.setState({
        blinkStatus:true
      },()=>{
        setTimeout(()=>{
          this.setState({
            blinkStatus:false
          })
        },data.duration +500)
      })
    })
    socket.on("powData", data => {
      if(this.state.means && this.state.blinks.length>0){
        
      let alphaState= Math.abs(data.alpha - this.state.means.meanAlertAlpha) > Math.abs(data.alpha - this.state.means.meanDrowsyAlpha); 
      let betaState= Math.abs(data.beta - this.state.means.meanAlertBeta) > Math.abs(data.beta - this.state.means.meanDrowsyBeta); 
      let thetaState= Math.abs(data.theta - this.state.means.meanAlertTheta) > Math.abs(data.theta - this.state.means.meanDrowsyTheta); 
      let bandState = this.getMode([alphaState,betaState,thetaState]);
      let blinkState = Math.abs(this.state.blinks[this.state.blinks.length-1].count - this.state.means.meanAlertBlinks) > Math.abs(this.state.blinks[this.state.blinks.length-1].count - this.state.means.meanDrowsyBlinks);
      let blinkDurationState = Math.abs(this.state.blinks[this.state.blinks.length-1].meanBlinkDuration - this.state.means.meanAlertDuration) > Math.abs(this.state.blinks[this.state.blinks.length-1].meanBlinkDuration - this.state.means.meanDrowsyDuration); 
      let drowsyState = this.getMode([blinkState,blinkDurationState]);
      console.log(drowsyState)
        this.setState({
          drowsyState
        },()=>{
          if(drowsyState){
            if(this.state.volume){
              var audio = new Audio(require('./sound/alert.mp3'));
              audio.play();
            }
          }
        })
      }
      let bands =[...this.state.bands];
      bands.push({
        alpha:data.alpha.toFixed(2),
        beta: data.beta.toFixed(2),
        theta: data.theta.toFixed(2)
      })
      this.setState({
        loading:false,
        bands
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
      console.log(response,'means')
      this.setState({
        means:response.data.means,
        currentState:!this.state.currentState,
        loading:true
      })
    }catch(e){
      console.log(e)
    }
  }

  unsubscribeSocket=async()=>{
    try{
      let response = await Axios.get(`http://localhost:8000/unsub?name=${this.state.name}`);
      this.setState({
        currentState:!this.state.currentState,
        userId: response.data.id,
        minutes:response.data.minutes,
        modal:true
      })
    }catch(e){
      console.log(e)
    }
  }

  toggle=()=>{
    this.setState({
      modal:!this.state.modal
    })
  }

  handleSubmit=async()=>{
    console.log(this.state.value);
    try{
      
        let response = await Axios.post('http://localhost:8000/updatePost',{
          id:this.state.userId,
          min:this.state.value.min,
          max:this.state.value.max
      })
      console.log(response);
      this.setState({
        modal:false
      })
    }catch(e){
      console.log(e)
    }
  }
  render(){
  return (
    <div className="App" style={{minHeight:'100vh',overflow:'hidden',background:this.state.drowsyState?'#CA0B00':'black'}}>
      <Navbar  dark expand="md" style={{backgroundColor:'black'}}>
      <NavbarBrand href="/"><img src='/logo.png'  style={{height:50,width:50,marginRight:10}}/>Driver Drowsiness Detection System</NavbarBrand>
      <Nav className="ml-auto align-items-center" navbar>
        {this.state.loading?<Spinner color="white"/>:!this.state.currentState ?<NavItem>
          <NavLink onClick={this.renderSocket}><i class="fas fa-play-circle" style={{fontSize:40,color:'white'}}></i></NavLink>
        </NavItem>:<Fragment>
        <NavItem className="mx-1">
        <Button onClick={()=>this.setState({modal2:true})}>Show Blinks</Button>
        </NavItem>
        <NavItem className="mx-1">
        <Button onClick={()=>this.setState({modal3:true})}>Show Bands</Button>
        </NavItem>
        <NavItem>
        <Input type="text" name="name" id="name" placeholder="Enter Name" value={this.state.name} 
          onChange={(e)=>this.setState({name:e.target.value})}
        />
        </NavItem>
        <NavItem className="mx-1">
        <NavLink onClick={this.unsubscribeSocket}><i class="fas fa-stop-circle" style={{fontSize:40,color:'white'}}></i></NavLink>
        </NavItem>
        <NavItem>
          <NavLink onClick={()=>this.setState({
            volume:!this.state.volume
          })}><i class={this.state.volume?"fas fa-volume-up":"fas fa-volume-mute"} style={{fontSize:40,color:'white'}}></i></NavLink>
        </NavItem>
        </Fragment>}
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
      <Row className="justify-content-around my-2" >
        <Col md="6">
          <Alert color={this.state.drowsyState?"danger":"primary"} className="m-3 text-center">
            Driver State: <b>{this.state.drowsyState?'Drowsy':'Alert'}</b>
          </Alert>
        </Col>
      </Row>

      <Row className="justify-content-around my-2" >
        <Col md="6">
          <div className="text-center" style={{color:'white',fontWeight:'bold'}}>Blink</div> 
          <Progress value={this.state.blinkStatus?100:0} />
        </Col>
      </Row>
      
      <Row className="justify-content-center mt-4"  >
        <Col md="4" className="graph_container">
          <ReactApexChart options={this.state.alphaOptions} series={this.state.alphaSeries} type="line" height="210" />
        </Col>
        <Col md="4" className="graph_container">
          <ReactApexChart options={this.state.betaOptions} series={this.state.betaSeries} type="line" height="210" />

        </Col>
        
        {/* <Col md="1">
        <div class="progress progress-bar-vertical">
          <div class="progress-bar" role="progressbar" style={{height: this.state.blinks.length>0?(this.state.blinks[this.state.blinks.length-1].count * 100).toString() +'%':'0%'  }}>
          </div>
        </div>
        <p className="text-center mt-3 w-100" style={{color:'white'}}>Blinks</p>
        </Col> */}
      </Row>
      <Row className="my-4 justify-content-center" >
      <Col md="4" className="graph_container">
          <ReactApexChart options={this.state.gammaOptions} series={this.state.gammaSeries} type="line" height="210" />
        </Col>
        <Col md="4" className="graph_container">
          <ReactApexChart options={this.state.thetaOptions} series={this.state.thetaSeries} type="line" height="210" />
        </Col>
      </Row> 

      <Modal isOpen={this.state.modal2} toggle={()=>this.setState({modal2:!this.state.modal2})}>
        <ModalBody className="p-0 text-center">

          <Row className="justify-content-center">
            <Col md="12" >
            <Table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Blinks</th>
                  <th>Average Blink Duration</th>
                </tr>
              </thead>
              <tbody style={{maxHeight:300,overflowY:'scroll'}}>
                {this.state.blinks.map((b,index)=><tr key={index}>
                  <td>{index}</td>
                  <td>{b.count}</td>
                  <td>{b.meanBlinkDuration}</td>
                </tr>)}
              </tbody>
              </Table>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal isOpen={this.state.modal3} toggle={()=>this.setState({modal3:!this.state.modal3})}>
        <ModalBody className="p-0 text-center">

          <Row className="justify-content-center">
            <Col md="12" >
            <Table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Alpha</th>
                  <th>Beta</th>
                  <th>Theta</th>
                </tr>
              </thead>
              <tbody style={{maxHeight:300,overflowY:'scroll'}}>
                {this.state.bands.map((b,index)=><tr key={index}>
                  <td>{index}</td>
                  <td>{b.alpha}</td>
                  <td>{b.beta}</td>
                  <td>{b.theta}</td>
                </tr>)}
              </tbody>
              </Table>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      

      <Modal isOpen={this.state.modal} toggle={this.toggle} >
        <ModalHeader toggle={this.toggle}>Feedback</ModalHeader>
        <ModalBody className="text-center">
          <FormGroup>
            <Label>Select drowsy time</Label>
            <InputRange
              draggableTrack
              maxValue={this.state.minutes}
              minValue={0}
              value={this.state.value}
              onChange={value => this.setState({ value: value })}
              onChangeComplete={value => this.setState({value})} 
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleSubmit}>Submit</Button>{' '}
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>

      

    </div>
  );
  }
}

export default App;
