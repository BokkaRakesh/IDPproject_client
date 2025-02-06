import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudyService {
  private apiUrl = environment.apiUrl // Update with your backend API URL

  constructor(private http: HttpClient) {}

  // Method to retrieve all studies from the backend API
  getStudies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/studies`).pipe(
      catchError((error) => {
        console.error('Error retrieving studies:', error);
        throw error;
      })
    );
  }

  // Method to retrieve a specific study by ID
  getStudyById(studyId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${studyId}`).pipe(
      catchError((error) => {
        console.error('Error retrieving study:', error);
        throw error;
      })
    );
  }
getstudyRecords(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/studyRecords`).pipe(
      catchError((error) => {
        console.error('Error retrieving study:', error);
        throw error;
      })
    );
  }
  // Method to save a new study
  saveStudyData(studyData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, studyData).pipe(
      catchError((error) => {
        console.error('Error saving study:', error);
        throw error;
      })
    );
  }

  // Method to update an existing study
  updateStudyData(studyId: string, updatedStudyData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${studyId}`, updatedStudyData).pipe(
      catchError((error) => {
        console.error('Error updating study:', error);
        throw error;
      })
    );
  }

  // Method to delete a study by ID
  deleteStudy(studyId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${studyId}`).pipe(
      catchError((error) => {
        console.error('Error deleting study:', error);
        throw error;
      })
    );
  }

  // Method to export study data as JSON file
  exportStudies(): void {
    this.getStudies().subscribe({
      next: (studies) => {
        const blob = new Blob([JSON.stringify(studies, null, 2)], { type: 'application/json' });
        const fileURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'studies.json';
        a.click();
      },
      error: (err) => console.error('Error exporting studies:', err),
    });
  }
  checkStudyIdValidator(studyId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check-study-id/${studyId}`).pipe(
      catchError((error) => {
        console.error('Error retrieving study:', error);
        throw error;
      })
    );
  }
}
