import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import { NewsResponse, Article, ArticlesByCategoryAndPage } from '../interfaces';
import { map } from "rxjs/operators";
import { storedArticlesByCategory } from '../data/mock-news';


const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  

  constructor(private http: HttpClient) { }

  private articlesByCategoryAndPage:  ArticlesByCategoryAndPage = storedArticlesByCategory;

  private executeQuery<T>( endPoint: string ){
    console.log('Petición HTTP realizada');
    return this.http.get<T>(`${apiUrl}${ endPoint }`, {
      params: {
        apiKey: apiKey,
        country: 'us',
      }
    })
    
  }


  getTopHeadlines(): Observable<Article[]> {

    return this.getTopHeadlinesByCategory('business');

    // return this.http.get<NewsResponse>('https://newsapi.org/v2/top-headlines?country=us&category=business',{
    //   params:{
    //     apiKey: apiKey
    //   }
    // }).pipe(
    //   map(resp => resp.articles)
    // );
  }

  getTopHeadlinesByCategory(category: string, loadMore: boolean = false):Observable<Article[]>{

    return of(this.articlesByCategoryAndPage[category].articles);

    //que no pase de aca porque no va a hacer la consulta a la api porque no quiero pagar :v

    if( loadMore ){
      return this.getArticlesByCategory( category );
    }

    if( this.articlesByCategoryAndPage[category] ){
      return of(this.articlesByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory(category)

  }

  private getArticlesByCategory(category:string): Observable<Article[]> {


    if(Object.keys( this.articlesByCategoryAndPage ).includes(category) ){
      //ya existe y que no haga nada
      // this.ArticlesByCategoryAndPage[category].page += 1;
    }else{
      //No existe
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }

    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?country=us&category=${ category }&page=${ page }`)
    .pipe(
      map( ({articles})  => {

        if( articles.length === 0 ) return this.articlesByCategoryAndPage[category].articles;

        this.articlesByCategoryAndPage[category] = {
          page: page,
          articles: [...this.articlesByCategoryAndPage[category].articles, ... articles ]
        }

        return this.articlesByCategoryAndPage[category].articles;

      })
    );

  }

}
