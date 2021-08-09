import { useEffect, useState } from "react";
import "./Table.scss";
import  axios  from "axios";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const axio = axios.create({
    baseURL: 'http://localhost:5001/api/v1',
    timeout: 1000,
  });

const initialFormValue = {name: '', m1: '', m2: '', m3: ''};

function Table() {
    const [students, setStudents] = useState([]);
    const [pageMode, setPageMode] = useState('create');

    const [studentFormValue, setStudentFormValue] = useState(initialFormValue);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        getStudents();
        return () => {
            source.cancel("Landing Component got unmounted");
        };
    }, []);

    async function getStudents () {
            const { data } = await axio.get('/students', { cancelToken: source.token});
            setStudents( data && data.hasOwnProperty("data") ? data.data : []);
    }

    async function handleSubmit(evt) {
        evt.preventDefault();
        const { data } = await axio.post('/student/add', studentFormValue, { cancelToken: source.token});
        setStudents( data && data.hasOwnProperty("data") ? data.data : []);
        setStudentFormValue(initialFormValue);
    }

    async function  handleStudentUpdate(evt){
        evt.preventDefault();
        const { data } = await axio.post('/student/update', studentFormValue, { cancelToken: source.token});
        setStudents( data && data.hasOwnProperty("data") ? data.data : []);
        setPageMode('create');
        setStudentFormValue(initialFormValue);
    }

    async function handleStudentEdit(evt, value){
        evt.preventDefault();
        setStudentFormValue(value);
        setPageMode('edit');
    }

    async function handleStudentDelete(evt, id){
        evt.preventDefault();
        const { data } = await axio.post('/student/delete', {id}, { cancelToken: source.token});
        setStudents( data && data.hasOwnProperty("data") ? data.data : []);
    }

    return (
        <section className="wrapper">
            <div id="form--container" className="glass">
                <form className="form">
                    <input type="text" className="form-control-sm" placeholder="Name" value={studentFormValue.name}
                        onChange={e => setStudentFormValue({...studentFormValue, name: e.target.value})}/>
                    <input type="text" className="form-control-sm" placeholder="Mark 1" value={studentFormValue.m1}
                    onChange={e => setStudentFormValue({...studentFormValue, m1: e.target.value})}/>
                    <input type="text" className="form-control-sm" placeholder="Mark 2" value={studentFormValue.m2}
                    onChange={e =>setStudentFormValue({...studentFormValue, m2: e.target.value})}/>
                    <input type="text" className="form-control-sm" placeholder="Mark 3" value={studentFormValue.m3}
                    onChange={e =>setStudentFormValue({...studentFormValue, m3: e.target.value})}/>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={
                        (e) => pageMode === 'create' ? handleSubmit(e) : handleStudentUpdate(e)
                    }>{pageMode === 'create' ? 'Save' : 'Update'}</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={(_) => setStudentFormValue(initialFormValue)}>Reset</button>
                </form>
            </div>
        
            <div id="table--container" className="glass table-responsive">
              <table className="table table-hover caption-top table-sm align-middle">
                  <caption className="text-center">Student List</caption>
              <thead>
                  <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mark 1</th>
                  <th>Mark 2</th>
                  <th>Mark 3</th>
                  <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {students && students.map(({id, name, m1, m2, m3}, i) => (
                    <tr key={id}>
                        <td>{i+1}</td>
                        <td>{name}</td>
                        <td>{m1}</td>
                        <td>{m2}</td>
                        <td>{m3}</td>
                        <td>
                        <button type="button" className="btn btn-outline-info btn-sm m-right" onClick={(e) => handleStudentEdit(e, {id, name, m1, m2, m3})}>Edit</button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={(e) => handleStudentDelete(e, id)}>Delete</button>
                        </td>
                    </tr>
                  ))}
              </tbody>
              </table>
          </div>
       
      </section>
 );
}

export default Table;
