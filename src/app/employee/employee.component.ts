import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {
  dataSaved = false;
  employeeForm: any;
  allEmployees: Observable<Employee[]>;
  dataSource: MatTableDataSource<Employee>;
  selection = new SelectionModel<Employee>(true, []);
  employeeIdUpdate = null;
  message = null;

  filteredData :any[];
  
  CountryId = null;
  StateId = null;
  CityId = null;
  SelectedDate = null;
  isMale = true;
  isFeMale = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  // displayedColumns: string[] = ['select', 'EmployeeFirstName', 'EmployeeLastName', 'EmployeeDateNaiss','EmployeeGender','EmployeeDateEmbauche', 'EmployeeSalary', 'EmployeeAdresse', 'EmployeeDesignation','EmployeeAdresse', 'Edit', 'Delete'];
  displayedColumns : string[] = ['select', 'employeeFirstName', 'employeeLastName', 'employeeDateNaiss','employeeGender','employeeDateEmbauche', 'employeeSalary', 'employeeDesignation','employeeAdresse', 'Edit', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formbulider: FormBuilder, private employeeService: EmployeeService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    //   this.employeeService.getAllEmployee().subscribe(data => {
    //   this.dataSource = new MatTableDataSource(data);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
  }

  ngOnInit() {
    this.loadAllEmployees();
    this.employeeForm = this.formbulider.group({
      
      employeeFirstName: ['', [Validators.required]],
      employeeLastName: ['', [Validators.required]],
      employeeDateNaiss: ['', [Validators.required]],
      employeeGender: ['', [Validators.required]],
      employeeDateEmbauche: ['', [Validators.required]],
      employeeSalary: ['', [Validators.required]],
      employeeDesignation: ['', [Validators.required]],
      employeeAdresse: ['', [Validators.required]],
      
    });
    //this.FillCountryDDL();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }

 /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(r => this.selection.select(r));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row: Employee): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.employeeId + 1}`;
  }
  
  DeleteData() {
    debugger;
    const numSelected = this.selection.selected;
    if (numSelected.length > 0) {
      if (confirm("Are you sure to delete items ")) {
        this.employeeService.deleteData(numSelected).subscribe(result => {
          this.SavedSuccessful(2);
          this.loadAllEmployees();
        })
      }
    } else {
      alert("Select at least one row");
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadAllEmployees() {
    this.employeeService.getAllEmployee().subscribe(data => {
      
      this.dataSource = new MatTableDataSource(data);
      this.filteredData = this.dataSource.filteredData;
      console.log("All Employees");
      console.log(this.filteredData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  onFormSubmit() {
    this.dataSaved = true;
    const employee = this.employeeForm.value;
    this.CreateEmployee(employee);
    this.employeeForm.reset();
  }

  loadEmployeeToEdit(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId).subscribe(employee => {
      this.message = null;
      this.dataSaved = true;
      this.employeeIdUpdate = employee.employeeId;
      this.employeeForm.controls['employeeFirstName'].setValue(employee.employeeFirstName);
      this.employeeForm.controls['employeeLastName'].setValue(employee.employeeLastName);
      this.employeeForm.controls['employeeDateNaiss'].setValue(employee.employeeDateNaiss);
      this.employeeForm.controls['employeeDateEmbauche'].setValue(employee.employeeDateEmbauche);
      this.employeeForm.controls['employeeGender'].setValue(employee.employeeGender);
      this.employeeForm.controls['employeeAdresse'].setValue(employee.employeeAdresse);
      this.employeeForm.controls['employeeDesignation'].setValue(employee.employeeDesignation);
      this.employeeForm.controls['employeeSalary'].setValue(employee.employeeSalary);
      
      this.isMale = employee.employeeGender.trim() == "Masculin" ? true : false;
      this.isFeMale = employee.employeeGender.trim() == "Féminin" ? true : false;
    });

  }
  CreateEmployee(employee: Employee) {
    if (this.employeeIdUpdate == null) {
      console.log("👉️👉️👉️👉️👉️👉️👉️👉️👉️👉️ Added employee")
      console.log(employee);
      this.employeeService.createEmployee(employee).subscribe(
        () => {
          this.dataSaved = true;
          this.SavedSuccessful(1);
          this.loadAllEmployees();
          this.employeeIdUpdate = null;
          this.employeeForm.reset();
        }
      );
    } else {
      console.log("👉️👉️👉️👉️Updated employee Id")
      console.log(this.employeeIdUpdate);
      employee.employeeId = this.employeeIdUpdate;
      console.log("👉️👉️👉️👉️Updated employee✅️✅️✅️✅️✅️✅️");
      console.log(employee);
      this.employeeService.createEmployee(employee).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(0);
        this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.employeeForm.reset();
      });
    }
  }
  deleteEmployee(employeeId: number) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.employeeService.deleteEmployeeById(employeeId).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(2);
        this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.employeeForm.reset();

      });
    }

  }

  FillCountryDDL() {
    //this.allCountry = this.employeeService.getCountry();
   // this.allState = this.StateId = this.allCity = this.CityId = null;
  }



  resetForm() {
    this.employeeForm.reset();
    this.message = null;
    this.dataSaved = false;
    this.isMale = true;
    this.isFeMale = false;
    this.loadAllEmployees();
  }

  SavedSuccessful(isUpdate) {
    if (isUpdate == 0) {
      this._snackBar.open('Record Updated Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } 
    else if (isUpdate == 1) {
      this._snackBar.open('Record Saved Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else if (isUpdate == 2) {
      this._snackBar.open('Record Deleted Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
}
