import { Injectable } from '@nestjs/common';
import firestore from './utils/firebase';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async adding_sf_movie_data(data: Array<any>): Promise<string> {
    const moment = require('moment');
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB').replace(/\//g, '-');
    // console.log(formattedDate);
    await firestore.collection('sf_movies').doc(formattedDate).set({
      "date": formattedDate,
      "length": data.length,
    })
    data.forEach(movie => {
      // console.log(movie);
      const thaiDate = movie.date
      const formatdate = moment(thaiDate, 'D MMMM YYYY', 'th').format('DD-MM-YYYY');
      const date = moment(formatdate, 'DD-MM-YYYY').toDate();
      const unixTimestamp = date.getTime() / 1000;

      firestore.collection('sf_all_movies').where('name', '==', movie.name).limit(1).get()
        .then(snap => {
          if (snap.empty) {
            console.log(formatdate);
            firestore.collection('sf_all_movies').add({
              "name": movie.name,
              "date": formatdate,
              "rawdate": movie.date,
              "timestamp": unixTimestamp,
              "watchlist": 0,
              "url": movie.url,
              "sypnosis": movie.sypnosis,
            })
          } else {
            firestore.collection('sf_all_movies').where('name', '==', movie.name).limit(1).get()
              .then(snap => {
                snap.forEach(doc =>
                  firestore.collection('sf_all_movies').doc(doc.id).update({
                    "date": formatdate
                  }))
              })
          }
        }
        )
      firestore.collection('sf_movies').doc(formattedDate).collection('movie').add({
        "url": movie.url,
        "name": movie.name,
        "date": movie.date,
        "sypnosis": movie.sypnosis,
      })
    })
    return "SF movies have " + data.length
  }

  async adding_major_movie_data(data: Array<any>): Promise<string> {
    const moment = require('moment');
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB').replace(/\//g, '-');
    // console.log(formattedDate);
    console.log(data.length);

    await firestore.collection('major_movies').doc(formattedDate).set({
      "date": formattedDate,
      "length": data.length,
    })
    data.forEach(movie => {
      // console.log(movie);
      const thaiDate = movie.date
      const formatdate = moment(thaiDate, 'D MMMM YYYY').format('DD-MM-YYYY');
      const date = moment(formatdate, 'DD-MM-YYYY').toDate();
      const unixTimestamp = date.getTime() / 1000;

      firestore.collection('major_all_movies').where('name', '==', movie.name).limit(1).get()
        .then(snap => {
          if (snap.empty) {
            console.log(formatdate);
            firestore.collection('major_all_movies').add({
              "name": movie.name,
              "date": formatdate,
              "rawdate": movie.date,
              "timestamp": unixTimestamp,
              "watchlist": 0,
              "url": movie.url,
              "sypnosis": movie.sypnosis,
            })
          } else {
            firestore.collection('major_all_movies').where('name', '==', movie.name).limit(1).get()
              .then(snap => {
                snap.forEach(doc =>
                  firestore.collection('major_all_movies').doc(doc.id).update({
                    "date": formatdate,
                    "rawdate": movie.date,
                    "timestamp": unixTimestamp,
                    "watchlist": 0,
                    "url": movie.url,
                    "sypnosis": movie.sypnosis,
                  }))
              })
          }
        }
        )
      firestore.collection('major_movies').doc(formattedDate).collection('movie').add({
        "url": movie.url,
        "name": movie.name,
        "date": movie.date,
        "sypnosis": movie.sypnosis,
      })
    })
    return "MAJOR movies have " + data.length
  }

  async get_sf_movie_data(): Promise<any> {
    const currentDate = new Date();
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    console.log(unixTimestamp);

    const formattedDate = currentDate.toLocaleDateString('en-GB').replace(/\//g, '-');
    const sf_movie_data = await firestore.collection('sf_all_movies').where('timestamp', '>=', unixTimestamp).orderBy('timestamp', 'asc').orderBy('name', 'asc').get()
    const movie_data = sf_movie_data.docs.map(doc => doc.data());
    return movie_data
  }

  async get_major_movie_data(): Promise<any> {
    const currentDate = new Date();
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    console.log(unixTimestamp);

    const formattedDate = currentDate.toLocaleDateString('en-GB').replace(/\//g, '-');
    const sf_movie_data = await firestore.collection('major_all_movies').where('timestamp', '>=', unixTimestamp).orderBy('timestamp', 'asc').orderBy('name', 'asc').get()
    const movie_data = sf_movie_data.docs.map(doc => doc.data());
    console.log(movie_data.length);

    return movie_data
  }

  async get_sf_ranking(): Promise<any> {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    console.log(unixTimestamp);

    const movie = await firestore.collection('sf_all_movies').where('timestamp', '>=', unixTimestamp).get();
    const movie_data = movie.docs.map(doc => doc.data());
    movie_data.sort((a, b) => b.watchlist - a.watchlist)
    return movie_data.slice(0, 10)
  }

  async get_major_ranking(): Promise<any> {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    console.log(unixTimestamp);

    const movie = await firestore.collection('major_all_movies').where('timestamp', '>=', unixTimestamp).get();
    const movie_data = movie.docs.map(doc => doc.data());
    movie_data.sort((a, b) => b.watchlist - a.watchlist)
    return movie_data.slice(0, 10)
  }

  async addmovie(data: any) {
    await firestore.collection('users').doc(data.uid).collection('movie').where('name', '==', data.name).limit(1).get()
      .then(snap => {
        if (snap.size == 0) {
          firestore.collection('users').doc(data.uid).collection('movie').add({
            'name': data.name,
            'url': data.url,
            'sypnosis': data.sypnosis,
            'date': data.date,
            'timestamp': data.timestamp,
            'cinema': data.cinema
          })
          if (data.cinema == 'sf') {
            firestore.collection('sf_all_movies').where('name', '==', data.name).limit(1).get()
              .then(snap => {
                snap.forEach(docs => {
                  firestore.collection('sf_all_movies').doc(docs.id).update({
                    'watchlist': docs.data().watchlist + 1
                  })
                  firestore.collection('sf_all_movies').doc(docs.id).collection("users").add({
                    "uid": data.uid,
                    'token': data.token
                  })
                })
              })
          } else {
            firestore.collection('major_all_movies').where('name', '==', data.name).limit(1).get()
              .then(snap => {
                snap.forEach(docs => {
                  firestore.collection('major_all_movies').doc(docs.id).update({
                    'watchlist': docs.data().watchlist + 1
                  })
                  firestore.collection('major_all_movies').doc(docs.id).collection("users").add({
                    "uid": data.uid,
                    "token": data.token
                  })
                })
              })
          }
        } else {
          snap.forEach(doc => {
            firestore.collection('users').doc(data.uid).collection('movie').doc(doc.id).update({
              'name': data.name,
              'url': data.url,
              'sypnosis': data.sypnosis,
              'date': data.date,
              'timestamp': data.timestamp
            })
          })
        }
      })
  }

  async get_user_movie(data: any): Promise<any> {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    console.log(unixTimestamp);

    const movie = await firestore.collection('users').doc(data.uid).collection('movie').where('timestamp', '>=', unixTimestamp).orderBy('timestamp', 'asc').get()
    const movie_data = movie.docs.map(doc => doc.data());
    return movie_data
  }

  async remove_movie(data: any): Promise<any> {
    console.log(data);

    await firestore.collection('users').doc(data.uid).collection('movie').where('name', '==', data.name).limit(1).get()
      .then(snap => {
        snap.forEach(docuser => {
          console.log("user ", docuser.id);
          firestore.collection("users").doc(data.uid).collection('movie').doc(docuser.id).delete()
          if (docuser.data().cinema == 'sf') {
            firestore.collection("sf_all_movies").where('name', '==', data.name).limit(1).get()
              .then(snap => {
                snap.forEach(doccinema => {
                  console.log("cinema ", doccinema.id);
                  firestore.collection("sf_all_movies").doc(doccinema.id).collection("users").where('uid', '==', data.uid).get()
                    .then(snap => {
                      snap.forEach(docuserid => {
                        firestore.collection('sf_all_movies').doc(doccinema.id).collection("users").doc(docuserid.id).delete()
                      })
                    }
                    )
                })
              })
          } else {
            firestore.collection("major_all_movies").where('name', '==', data.name).limit(1).get()
              .then(snap => {
                snap.forEach(doccinema => {
                  console.log("cinema ", doccinema.id);
                  firestore.collection("major_all_movies").doc(doccinema.id).collection("users").where('uid', '==', data.uid).get()
                    .then(snap => {
                      snap.forEach(docuserid => {
                        firestore.collection('major_all_movies').doc(doccinema.id).collection("users").doc(docuserid.id).delete()
                      })
                    }
                    )
                })
              })
          }
        })
      })
  }

  async notification() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    console.log(unixTimestamp);

    await firestore.collection('sf_all_movies').where('timestamp', '==', unixTimestamp + (86400)).get()
      .then(snapm => {
        snapm.forEach(docm => {
          console.log(docm.data().name, docm.data().date);
          firestore.collection('sf_all_movies').doc(docm.id).collection('users').get()
            .then(snap => {
              snap.forEach(doc => {
                console.log(doc.data());
                try {
                  firestore.collection('users').where('token', '==', doc.data().token).get()
                    .then(snap => {
                      snap.forEach(doc => {
                        firestore.collection('users').doc(doc.id).collection('movie').where('timestamp', '==', unixTimestamp + 86400).get()
                          .then(snapm => {
                            snapm.forEach(docm => {
                              firestore.collection('users').doc(doc.id).collection('movie').doc(docm.id).delete()
                            })
                          })
                      })
                    })
                  this.sfsendmessage(docm.data().name, doc.data().token)
                } catch (err) {
                  console.log(err);

                }
              })
            })
        })
      })

    await firestore.collection('major_all_movies').where('timestamp', '==', unixTimestamp + (86400)).get()
      .then(snapm => {
        snapm.forEach(docm => {
          console.log(docm.data().name, docm.data().date);
          firestore.collection('major_all_movies').doc(docm.id).collection('users').get()
            .then(snap => {
              snap.forEach(doc => {
                console.log(doc.data());
                try {
                  firestore.collection('users').where('token', '==', doc.data().token).get()
                    .then(snap => {
                      snap.forEach(doc => {
                        firestore.collection('users').doc(doc.id).collection('movie').where('timestamp', '==', unixTimestamp + 86400).get()
                          .then(snapm => {
                            snapm.forEach(docm => {
                              firestore.collection('users').doc(doc.id).collection('movie').doc(docm.id).delete()
                            })
                          })
                      })
                    })
                  this.majorsendmessage(docm.data().name, doc.data().token)
                } catch (err) {
                  console.log(err);
                }
              })
            })
        })
      })
  }

  async sfsendmessage(name: string, token: string) {
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      'message': name + " ได้เข้าฉายแล้วที่ SF Cinema สามารถทำการจองตั๋วหนังได้ผ่าน\nhttps://www.sfcinemacity.com/movies/now-showing\nและตรวจสอบโปรโมชั่นได้ที่\nhttps://www.sfcinemacity.com/promotions"
    });
    var config = {
      method: 'post',
      url: 'https://notify-api.line.me/api/notify',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async majorsendmessage(name: string, token: string) {
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      'message': name + " ได้เข้าฉายแล้วที่ Major Cineplex สามารถทำการจองตั๋วหนังได้ผ่าน\nhttps://www.majorcineplex.com/movie\nและตรวจสอบโปรโมชั่นได้ที่\nhttps://www.majorcineplex.com/promotion"
    });
    var config = {
      method: 'post',
      url: 'https://notify-api.line.me/api/notify',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
