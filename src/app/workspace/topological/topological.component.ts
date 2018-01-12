import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl,DomSanitizer } from '@angular/platform-browser';
import { AuthService} from '../../auth/auth.service';

@Component({
  selector: 'ices-topological',
  templateUrl: './topological.component.html',
  styleUrls: ['./topological.component.css']
})
export class TopologicalComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, private authService: AuthService) {

      const apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
      let tempUrl = apiConfig['topoURL'];
      tempUrl = tempUrl.indexOf('?') === -1 ? (tempUrl + '?language=zh') : tempUrl;
      const TOPO_ENDPOINT = tempUrl + '&token=' + localStorage.getItem('token') + '&userName=' + localStorage.getItem('userMessage');
      this.url = sanitizer.bypassSecurityTrustResourceUrl(TOPO_ENDPOINT);
  }
  url: SafeResourceUrl;

  bodyHeight = 0;
  ngOnInit() {
      this.bodyHeight = document.body.scrollHeight - 120;
  }

}
