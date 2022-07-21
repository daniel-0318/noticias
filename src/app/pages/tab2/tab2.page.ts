import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from '../../interfaces';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  categories: string[] = ['business','entertainment','general','health','science','sports','technology'];
  selectedCategory: string = this.categories[0];
  public articles: Article[]=[]
  

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory)
    .subscribe(articles =>{
      console.log(articles);
      this.articles = [...articles];
    });
  }

  segmentChanged(event: any){
    this.selectedCategory = event.detail.value;
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory)
    .subscribe(articles =>{
      console.log(articles);
      this.articles = [...articles];
    });
    
  }

  loadData(){
    console.log("Cargando más");
    
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory, true)
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
