import React, { useState, useEffect, useContext,useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { AnswersContext, UserContext } from '../context/Context';
import '../TestResult.css';
import API_KEY from '../config';


function Intro(){
    return(
        <div className="intro">
            <h2>직업가치관검사 결과표</h2>
            <p>직업가치관이란 직업을 선택할 때 영향을 끼치는 자신만의 믿음과 신념입니다. 따라서 여러분의 직업생활과 관련하여 포기하지 않는 무게중심의 역할을 한다고 볼 수 있습니다. 직업가치관검사는 여러분이 직업을 선택할 때 상대적으로 어떠한 가치를 중요하게 생각하는지를 알려줍니다. 또한 본인이 가장 중요하게 생각하는 가치를 충족시켜줄 수 있는 직업에 대해 생각해 볼 기회를 제공합니다.</p>
        </div>
    );
}

function UserProfile(props){
    return(
        <table className="user-profile">
          <thead>
            <tr>
                <th>이름</th>
                <th>성별</th>
                <th>검사일</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>{props.data.name}</td>
                <td>{props.data.gender}</td>
                <td>{props.data.date}</td>
            </tr>
          </tbody>
        </table>
    );
}



// function UserProfile(props){
//   const classes = useStyles();
//   return(
//     <TableContainer>
//     <Table className={classes.table} aria-label="simple table" >
//       <TableHead>
//         <TableRow>
//           <TableCell> 이름 </TableCell>
//           <TableCell > 성별 </TableCell>
//           <TableCell > 날짜 </TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody >
//         <TableRow >
//           <TableCell>{props.data.name}</TableCell>
//           <TableCell>{props.data.gender}</TableCell>
//           <TableCell>{props.data.date}</TableCell>
//         </TableRow>
//       </TableBody>
//     </Table>
//   </TableContainer>
//   );
// }

class BarChart extends React.Component {

    render() {
  
      const state = {
          labels: this.props.label,
          datasets: [
            {
              backgroundColor: [
                'rgba(255, 154, 162, 0.5)',
                'rgba(255, 183, 178, 0.5)',
                'rgba(255, 218, 193, 0.5)',
                'rgba(255, 206, 86, 0.3)',
                'rgba(226, 240, 203, 0.6)',
                'rgba(181, 234, 215, 0.5)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(255, 154, 162, 1)',
              'rgba(255, 183, 178, 1)',
              'rgba(255, 218, 193, 1)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(226, 240, 203, 1)',
              'rgba(181, 234, 215, 1)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ],
              borderWidth: 1,
              data: this.props.data
            }
          ]
        }
  
      return (
        <div className ="chart-container">
          <Bar
            id = "barChart"
            data={state}
            width = {800}
            height ={500}
            options={{
              title:{
                display:true,
                text:'직업가치관결과',
                fontSize:20,
                fontColor:"white"
              },
              legend:{
                display:false,
                position:'right'
              },
              responsive: false,
              maintainAspectRatio: false,
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true,
                          fontColor: "white"
                      }
                    }],
                  xAxes: [{
                    ticks: {
                        fontColor: "white",
                    }
                }]
                 }
            }}
          />
        </div>
      );
    }
  }
  
function RelatedJobs(props){
  //아 api 구조 너무 화가 난다..!
  let jobsTableContents = [];

  for (var i=0; i<props.factors.length; i++){
    let eachRow = props.data.map(([jobSeq, jobTitle, index])=>{
      return index==i+1?
      //  <a href ={ `http://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=${jobSeq}`} 
      //  style={{marginRight:"10px"}}
      //  key={jobSeq}>
      //    {jobTitle}
      //  </a>:""
      <button 
        href ={ `http://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=${jobSeq}`} 
        style={{marginRight:"10px"}}
        key={jobSeq}
        value={jobSeq}
        type="button"
        onClick={(e)=>{props.do(e)}}
        className="nostyle-button">
        {jobTitle}
      </button>:""
      });

    eachRow = eachRow.filter(function(element){ return element != "";});
    jobsTableContents.push(eachRow);
  }
 
  let finalContents = props.factors.map(function(value, ind){
    return[value,jobsTableContents[ind]]
  });

  finalContents = finalContents.filter(function(element){ return element[1] != "";});
  console.log(finalContents);
  
      return(
          <table className="jobs-table">
            <caption>종사자 평균 학력별</caption>
            <thead>
              <tr>
                <th>분야</th>
                <th>직업명</th>
              </tr>
            </thead>
            <tbody>
              {finalContents.map(each=>{
                return(
                <tr key={each[0]}>
                  <td>{each[0]}</td>
                  <td>{each[1]}</td>
                </tr>
              )})}
            </tbody>
          </table>
      );
}

function RelatedMajors(props){
  let jobsTableContents = [];

  for (var i=0; i<props.factors.length; i++){
    let eachRow = props.data.map(each=>{
      return each[2]==i+1?
       <a href ={ `http://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=${each[0]}`} 
       style={{marginRight:"10px"}}
       key={each[0]}
       target="_blank"
       >
         {each[1]}
       </a>:""
      });

    eachRow = eachRow.filter(function(element){ return element != "";});
    jobsTableContents.push(eachRow);
  }
 
  let finalContents = props.factors.map(function(value, ind){
    return[value,jobsTableContents[ind]]
  });

  finalContents = finalContents.filter(function(element){ return element[1] != "";});
      return(
          <table className="jobs-table">
            <caption>종사자 평균 전공별</caption>
            <thead>
              <tr>
                <th>분야</th>
                <th>직업명</th>
              </tr>
            </thead>
            <tbody>
            {finalContents.map(each=>{
                return(
                <tr key={each[0]}>
                  <td>{each[0]}</td>
                  <td>{each[1]}</td>
                </tr>
              )})}
            </tbody>
          </table>
      );
}

function ClickedJob(props){

  const chartColors = ['#009fff', '#00c5ff','#00dfff','#00ffdf','#7dfffc','#cbfffe','#a0edff'];
  const jobPossibility = props.data.job_possibility[0].chart_item_list;
  let labelData = [];
  let jobPossibilityData =[];
  for(var i = 0 ; i <jobPossibility.length; i++){
    labelData.push(jobPossibility[i].chart_key);
    jobPossibilityData.push(jobPossibility[i].chart_value);
  }
  console.log(labelData);
  
  const options={
    legend: {
      display: true,
      position: "right",
      labels:{
        fontColor:"white"
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  }

  const doughnutData={
    maintainAspectRatio: false,
    responsive: false,
    labels: labelData,
    datasets: [
      {
        data: jobPossibilityData,
        backgroundColor: chartColors,
        hoverBackgroundColor: chartColors
      }
    ]
  }
  return(
  <div className="jobdata-container">
    <h3>{props.data.job}</h3>
    <div className="doughnut-container">
      <Doughnut data={doughnutData} options={options}></Doughnut>
    </div>
    <div className="detail">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <a 
      href ={ `http://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=${props.jobSeq}`} 
      target="_blank">
      상세정보 
    </a>
  </div>
  );
}

function TestResult(){
    const { seq } = useParams();
    const test_result_api = `https://inspct.career.go.kr/inspct/api/psycho/report?seq=${seq}`;
    const {user, setUser} = useContext(UserContext);
    const {answers, setAnswers} = useContext(AnswersContext);

    const [userInfo, setUserInfo] = useState({});
    const [Score, setScore] = useState();
    const [maxScores, setMaxScores] = useState([-1,-1]);
    const [job ,setJob] = useState();
    const [jobData, setJobData] = useState();

    const jobs_api = useMemo(()=>{
      return `https://inspct.career.go.kr/inspct/api/psycho/value/jobs?no1=${maxScores[0]}&no2=${maxScores[1]}`;
    },[maxScores]);

    const majors_api = useMemo(()=>{
      return `https://inspct.career.go.kr/inspct/api/psycho/value/majors?no1=${maxScores[0]}&no2=${maxScores[1]}`;
    },[maxScores]);
    // useMemo없이 동기적으로 api주소를 지정하는 코드를 짜면 맨 처음에 maxScores값이 -1인 채로 들어가고,
    // maxScores값이 바뀐다고 해도 바뀐 값을 반영해서 변수를 재선언해주지 않는다.
    // 따라서 useMemo를 사용해서 jobs api와 majors api를 선언해주면 좋다.


    const clickJob = e =>{
      setJob(e.target.value);
    }

    const jobs_data_api = "https://www.career.go.kr/cnet/openapi/getOpenApi.json";

    const [careersResult, setCareers] = useState();
    const [majorsResult, setMajors] = useState();

    const factors = ["능력발휘", "자율성", "보수", "안정성", "사회적 인정", "사회봉사", "자기계발", "창의성"];
    const careers = ['중졸이하','고졸','전문대졸','대졸','대학원졸'];
    const majors = ['계열무관','인문','사회','교육','공학','자연','의학','예체능'];

    const clearAll = e => { 
      setUser({name: '', gender:''});
      setAnswers([]);
    }

    //학력별 머시기 가져오는 함수
    const getJobs = useCallback(async()=>{
      const responseJobs = await axios.get(jobs_api);
      const responseMajors = await axios.get(majors_api);
      setCareers(responseJobs.data);
      setMajors(responseMajors.data);
    },[maxScores]);

    const getTestResult = useCallback(async()=>{
        const response = await axios.get(test_result_api);
        console.log(response);
        const gender = response.data.inspct.gender === 100323? "남성": "여성";
        const date = new Date(response.data.inspct.registDt);
        setUserInfo({name: response.data.inspct.nm, gender: gender ,date: date.toLocaleDateString()});

        const wonScore = response.data.result.wonScore.trim().split(" ");
        let formatScore = [];

        for(var i = 0; i<factors.length; i++){
            formatScore.push(Number(wonScore[i].slice(-1)));
        }
        setScore(formatScore);

        let firstMax = formatScore.indexOf(Math.max(...formatScore));
        formatScore[firstMax] = -1;
        let secondMax = formatScore.indexOf(Math.max(...formatScore));
        setMaxScores([firstMax+1, secondMax+1]);
        //함수로 제일 큰 값을 구하고 싶은데 useMemo없이 그냥 함수로 정의해도 될까?
    },[test_result_api]);

    const getJobsData = useCallback(async()=>{
      let request = {
        params: {
          "apiKey": API_KEY,
          "svcType": "api",
          "svcCode":"JOB_VIEW",
          "contentType":"json",
          "gubun": "job_apti_list",
          "jobdicSeq": job
        }
      }
      const response = await axios.get(jobs_data_api, request);
      setJobData(response.data.dataSearch.content[0]);
    },[job]);

    useEffect(()=>{
      getTestResult();
    },[]);

    useEffect(()=>{
      getJobs();
    },[maxScores]);

    useEffect(()=>{
      if(job){
        getJobsData();
      }
    },[job]);

    console.log(jobData);

    return(
        <>
        <Intro></Intro>
        <br/>
        <UserProfile data={userInfo}></UserProfile>
        <br/>
        <BarChart label={factors} data={Score}></BarChart>
        <br/>
        <hr/>
        <h2>가치관과 관련이 높은 직업</h2>
        <br/>
        {jobData? <ClickedJob data={jobData} jobSeq={job}/>:""}
        <br/>
        {careersResult? <RelatedJobs factors={careers} data={careersResult} do ={clickJob}/> : ""}
        <br/>
        <br/>
        {majorsResult? <RelatedMajors factors={majors} data={majorsResult} do={clickJob}/> : ""}
        <br/>
        <Link to="/"><button onClick={clearAll}>다시 검사하기</button></Link>
        </>
    );
}

export default TestResult;