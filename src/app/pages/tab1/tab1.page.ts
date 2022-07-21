import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from '../../interfaces';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public articles: Article[] = [];

  constructor(private newsService: NewsService) {}


  ngOnInit() {
    this.newsService.getTopHeadlines()
    .subscribe(articles => this.articles.push( ...articles) );
  }

  loadData(){
    console.log("Cargando más");
    
    this.newsService.getTopHeadlinesByCategory('business', true)
    .subscribe(articles => {

      if(articles.length == this.articles.length){
        this.infiniteScroll.disabled = false;

        return;
      }

      this.articles = articles;
      this.infiniteScroll.complete();
    })
  }

}
