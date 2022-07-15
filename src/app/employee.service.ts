import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee} from './employee';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url = 'https://localhost:44367/api/Employee';
    constructor(private http: HttpClient) { }

  getAllEmployee(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url + '/GetAllEmployees');
  }

  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(this.url + '/GetEmployeesById/id?id=' + employeeId);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Employee>(this.url + '/SaveEmployees',employee, httpOptions);
  }


  updateEmployee(employee: Employee): Observable<Employee> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Employee>(this.url + '/SaveEmployees', employee, httpOptions);
  }

  deleteEmployeeById(employeeid: number): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + '/DeleteEmployee?id=' + employeeid, httpOptions);
  }

  deleteData(user: Employee[]): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<string>(this.url + '/DeleteRecord/', user, httpOptions);
  }  
}
