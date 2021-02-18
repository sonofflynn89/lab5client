import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

//////////////////////
// Needed URLS
/////////////////////

const QUERY_URL = 'http://localhost:8010/proxy/sky/cloud/ckl9qtx1h000n48vlfkmw2u70';
const EVENT_URL = 'http://localhost:8010/proxy/sky/event/ckl9qtx1h000n48vlfkmw2u70/client';

//////////////////////////
// Interfaces
//////////////////////////

interface Profile {
  name?: string,
  location?: string,
  threshold?: number,
  sms_number?: string
}

interface Reading {
  temperature: number,
  timestamp: string | Date,
}

//////////////////////////
// Component Definition
//////////////////////////

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  currentReading: Reading;
  readings: Reading[] = [];
  showStart = true;
  profile: Profile;
  editing = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.refresh();
    this.setProfile();
  }

  /////////////////////////
  // API Calls
  /////////////////////////

  getTemperatureReadings() {
    return this.http.get(`${QUERY_URL}/temperature_store/temperatures`)
  }

  getThresholdViolations() {
    return this.http.get(`${QUERY_URL}/temperature_store/threshold_violations`)
  }

  getProfile() {
    return this.http.get(`${QUERY_URL}/sensor_profile/profile`)
  }

  updateProfile(profile: Profile) {
    return this.http.post(`${EVENT_URL}/sensor/profile_updated`, profile)
  }

  /////////////////////////
  // UI Actions
  ////////////////////////

  refresh() {
    this.getTemperatureReadings().subscribe((r: Reading[]) => {
      this.readings = r.map(el => {
        el.timestamp = new Date(el.timestamp);
        return el;
      });
      this.currentReading = this.readings[0];
      console.log(r);
    });
  }

  setProfile() {
    this.getProfile().subscribe((p: Profile) => this.profile = p)
  }

  togglePage() {
    this.showStart = !this.showStart;
  }

  saveChanges() {
    this.updateProfile(this.profile).subscribe();
  }
}


