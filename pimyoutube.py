#!/usr/bin/python

# This sample executes a search request for the specified search term.
# Sample usage:
#   python search.py --q=surfing --max-results=10
# NOTE: To use the sample, you must provide a developer key obtained
#       in the Google APIs Console. Search for "REPLACE_ME" in this code
#       to find the correct place to provide that key..

import socket
import json
from flask import Flask, request, jsonify


from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

app = Flask(__name__)

# Set DEVELOPER_KEY to the API key value from the APIs & auth > Registered apps
# tab of
#   https://cloud.google.com/console
# Please ensure that you have enabled the YouTube Data API for your project.
DEVELOPER_KEY = 'AIzaSyDvFMU9gV2cDHUAE7vmezlfBSWZuZAzj18'
YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'
youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)

#Arrays

channels = []


def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

@app.route("/channel", methods=["POST"])
def postJsonHandler():
  print (request.is_json)
  content = request.get_json()
  mylist = list()
  for c in content:
    chain = c["channel"] 
    mylist.append (youtube_channel_views(chain))
  print(mylist)
  return jsonify(mylist)

""" def youtube_channel_views(Searchterm):
  ChannelDic=dict()
  channelId=youtube_search_ChannelId(Searchterm)
  if channelId!=0 :
    search_response = youtube.channels().list(
      id=channelId,
      part='snippet,statistics'
    ).execute()
    
    for search_result in search_response.get('items', []):
      ChannelDic = {'Title': search_result['snippet']['title'], 'Views':search_result['statistics']['viewCount']}
  else:
    ChannelDic={'Title':Searchterm,'views':'0'}
  return jsonify(ChannelDic) """

def youtube_channel_views(chain):
    ChannelDic=dict()
    channelId=youtube_search_ChannelId(chain)
    if channelId!=0 :
      search_response = youtube.channels().list(
        id=channelId,
        part='snippet,statistics'
      ).execute()
        
      for search_result in search_response.get('items', []):
        ChannelDic = {'Title': search_result['snippet']['title'], 'Views':search_result['statistics']['viewCount']}
    else:
      ChannelDic={'Title':chain,'Views':'0'}
    return ChannelDic

def youtube_video_views(videoId):

  search_response = youtube.videos().list(
    id=videoId,
    part='snippet,statistics,contentDetails'
  ).execute()
  videoDes=dict()
  for search_result in search_response.get('items', []):
    videoDes= {'Title':search_result['snippet']['title'],'Views':search_result['statistics']['viewCount'],
                                    'Duration':search_result['contentDetails']['duration']} 
  return videoDes

def youtube_search_ChannelId(Searchterm):

  search_response = youtube.search().list(
    q=Searchterm,
    part='id,snippet',
    maxResults='15',
    order='viewCount',
    type='channel'
  ).execute()
  
  channelId=0
  for search_result in search_response.get('items', []):
    if search_result['id']['kind'] == 'youtube#channel' and search_result['snippet']['title'] == Searchterm:
      channelId = search_result['id']['channelId']
      break
    

  return channelId
def verifyvideoduration (duration):
  time=duration[2:]
  """ print(time)
  print(time.find('H')) """
  if time.find('H')>0:
    return True
  elif time.find('M')>0:
    M=time[:time.find('M')]
    if int(M)>10:
      return True

  return False

@app.route("/program", methods=["POST"])
def postJsonHandler2():
  print (request.is_json)
  content = request.get_json()
  mylist = list()
  for c in content:
    """ print (c["channel"])"""
    chain = c["channel"] 
    program = c["program"]
    """ print (youtube_search_videos_by_ChannelId(program,chain)) """
    mylist.append(youtube_search_videos_by_ChannelId(program,chain))
  print(mylist)
  return jsonify(mylist)

def youtube_search_videos_by_ChannelId(Searchterm,channelname):
  chid=youtube_search_ChannelId(channelname)
  if chid != 0 :
    search_response = youtube.search().list(
      q=Searchterm,
      part='id,snippet',
      maxResults='15',
      channelId=youtube_search_ChannelId(channelname),
      order='date',
      # publishedAfter='2018-04-20T00:00:00Z',
      videoDuration='any',
      type='video'
    ).execute()

    
    for search_result in search_response.get('items', []):
      if search_result['id']['kind'] == 'youtube#video':
        video=youtube_video_views(search_result['id']['videoId'])
        if verifyvideoduration(video['Duration']):
          return (video)
  video={'Title':Searchterm,'Views':'0'}
  return (video)



if __name__ == '__main__':
    ip= get_ip_address()
    app.run(debug=True,host=ip)


