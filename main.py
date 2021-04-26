from bs4 import BeautifulSoup

# example html from beautifulsoup documentation
html_doc = """<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title"><b>The Dormouse's story</b></p>

<p class="story">Once upon a time there were three little sisters; and their names were
<a href="http://example.com/elsie" class="sister" id="link1">Elsie</a>,
<a href="http://example.com/lacie" class="sister" id="link2">Lacie</a> and
<a href="http://example.com/tillie" class="sister" id="link3">Tillie</a>;
and they lived at the bottom of a well.</p>

<p class="story">...</p>
"""


def main():
    soup = BeautifulSoup(html_doc, 'html.parser')  # assign individual html doc to parser
    # https://www.crummy.com/software/BeautifulSoup/bs4/doc/

    # Various useful functions like soup.get_text gets all the in-html text like Elsie/Lacie/Tillie, this might be useful
    # For creating the result
    print(soup.get_text())

    # Extracting all elements of a certain type:
    for link in soup.find_all('a'):
        print(link.get('href'))

    # You can also navigate through the html tree, .contents, .children, .descendants, .parent, etc

    # We might want to install a parser library as well, can do something like BeautifulSoup(markup, "[libary name]")
    # just need to figure out what use they have and if we need them
