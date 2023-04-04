from bs4 import BeautifulSoup as bs
import requests
import re
import json
from flask import Flask

app = Flask(__name__)

@app.route('/scraping_sf_movie' , methods = ['GET'])
def sf_movie():
    print("start scraping sf_movie test")
    url = "https://www.sfcinemacity.com/movies/coming-soon"
    res = requests.get(url)
    soup = bs(res.content,'html.parser')
    # print(res)
    # print(soup)
    data = soup.find_all('div',type="coming-soon")
    # print(data)
    dictionary = []
    for x in data:
        # print("yes")
        # print("->",x.find(href=True))
        data = re.findall("/movie/.+\"\s",str(x))
        data = data[0].split()
        # print("->", data)
        # print(data[0][:-1])
        try:
            movie_url = "https://www.sfcinemacity.com"+data[0][:-1]
            res_movie = requests.get(movie_url,timeout=10)
            soup= bs(res_movie.content,'html.parser')
            soup_movie = soup.find('div',class_='movie-detail-poster')
            # print(soup_movie)
            
            poster_url = soup_movie.find('div',class_='poster').find('img')['src']
            movie_name = soup_movie.find(class_='title').text
            release_date = soup_movie.find(class_='release').find_all("span")[1].text
            genre = soup_movie.find(class_='genre').find_all("span")[1].text.replace(" ",'').split(',')
            sypnosis = soup.find('div',class_='synopsis-detail').text
            movie_info = {"url" : poster_url , "name" : movie_name , "date": release_date , "genre" : genre , "sypnosis" : sypnosis}
            dictionary.append(movie_info)
            print(data[0][:-1])
        except requests.exceptions.Timeout:
            print('Timeout')
        # break
    print(" ")
    print("Finish Scraping SF Movies")
    return {"data" : dictionary}
    # with open("sf.json", "w") as outfile:
    #     json.dump(dictionary, outfile)

@app.route('/scraping_major_movie' , methods = ['GET'])
def major_movie():
    print("major_movie")
    url = "https://www.majorcineplex.com/movie"
    res = requests.get(url,timeout=10)
    soup = bs(res.content,'html.parser')
    # print(res)
    # print(soup)
    data = soup.find('div',class_="box-movie-coming")
    # new_data = data.find('div',class_="box-movies-list")
    movie_dat = data.find_all('div',class_="ml-box")
    # print(len(movie_dat))
    dictionary = []
    for x in movie_dat:
        movie_name = x.find('div',class_='mlb-name').text.strip()
        release_date = x.find('div',class_='mlb-date').text
        poster = x.find('div',class_='mlb-cover')
        hover = x.find('div',class_='mlbc-hover')
        page = hover.find_all('a')[1]
        print(page['href'])
        try:
            urlm = "https://majorcineplex.com"+page['href']
            resm = requests.get(urlm,timeout=10)
            soupm = bs(resm.content,'html.parser')
            datam = soupm.find('div',class_='bscb-body info')
            # print(datam)
            sypnosis = ''
            p_tag = datam.find_all('p')
            for p in p_tag:
                sypnosis = sypnosis + p.text
            # print(sypnosis)
            url = re.findall("https://.*.jpg",str(poster))
            
            # print(release_date)
            # print(movie_name.text.strip())
            # print(date.text)
            # print(url[0])
            movie_info = {"url" : url[0] , "name" : movie_name , "date": release_date , "genre" : "test genre" , "sypnosis" : sypnosis}
            dictionary.append(movie_info)
        except requests.exceptions.Timeout:
            print("Timeout")
        # print(movie_name , end = ' ')
    print(" ")
    print("Finish Scraping Major Movies")
    return {"data" : dictionary}
    # with open("major.json", "w" , encoding = 'utf-8') as outfile:
    #     json.dump(dictionary, outfile)
    # return "Finish scraping MAJOR Movies"
    
if __name__ == '__main__':
    app.run()
# sf_movie()
# major_movie()