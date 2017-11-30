from flask import Flask, render_template, request, redirect, jsonify
import api

glrApiPath = '/api/link/'

app = Flask(__name__)
app.secret_key = 'tis is ma suppa sekkret string that aint tooo short'  # todo: change for production

if __name__ == "__main__":
    app.run(debug=True)


# start frontend --------------------------------------------------------------
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/?q=<query>')
def searchHandler(query):
    return 'searched ' + query
