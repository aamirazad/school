/* eslint-disable react/no-unescaped-entities */

import "./open-source.css";

export default function OpenSourcePage() {
  return (
    <div className="mx-96 open-body">
      <h1 className="open-h open-h1">
        How Open Source Software Powers The World
      </h1>

      <h2 className="open-h open-h2">What is open source software?</h2>
      <p id="intro" className="open-p">
        The term 'open source' is used to describe software whose source code is
        available to the public. Although this may seem uninportant, there are
        lots of advangatges to having code be open source both for the user and
        the developer.
      </p>
      <div className="">
        <img
          id="wall"
          src="https://live.staticflickr.com/2275/2246383366_bd18fb6259_c_d.jpg"
          alt="code on wall"
          width={175}
          height={175}
        />
        <p id="cite">
          <a
            id="gray"
            href="https://www.flickr.com/photos/42027916@N00/2246383366"
            target="_blank"
            rel="noopener noreferrer"
          >
            "Code on the Wall"
          </a>{" "}
          by{" "}
          <a
            id="gray"
            href="https://www.flickr.com/photos/42027916@N00"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nat W
          </a>{" "}
          licensed under{" "}
          <a
            id="gray"
            href="https://creativecommons.org/licenses/by-sa/2.0/?ref=openverse"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-SA 2.0
          </a>
        </p>
      </div>
      <p className="open-p">
        Github, is a very popluar code hosting platform. When you put your code
        on github, it is then open source, anyone can access the code. Others
        can "fork" your code, which is essentally chaning your code so it fits
        their needs. If a developer wants to imporve another users code, lets
        say they found a way to make the app 20% faster, they can then make a
        "pull request". The real developer can than see the pull request and if
        they like it, can "merge" it to their software.
      </p>

      <h2 className="open-h open-h2">Advantages of Open Source</h2>
      <h3 className="open-h open-h3">
        When an app is open source a developer can ...
      </h3>
      <ul className="open-ul">
        <img
          id="img"
          src="https://live.staticflickr.com/1262/1186846236_55c8eb1c46_w_d.jpg"
          alt="hacking"
        />
        <li className="open-li">Learn how an app works</li>
        <p className="open-p">
          Lets say a developer finds a feature in another persons app that they
          don't understand and want to learn how to have in their own app. They
          can just look at the code. Most of the time, open source developers
          publish docs that explain each feature.
        </p>
        <li className="open-li">Reveal security concerns</li>
        <p className="open-p">
          An open source is much more safe than proprietery software beacuse it
          is impossible to secretlly put ransomware or any other bad stuff
          integrated in the app.
        </p>
        <p id="cite" className="open-p attrannounceibution">
          "
          <a
            id="gray"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.flickr.com/photos/44093100@N00/1186846236"
          >
            iPhone hacked
          </a>
          " by{" "}
          <a
            id="gray"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.flickr.com/photos/44093100@N00"
          >
            bwana
          </a>{" "}
          is licensed under{" "}
          <a
            id="gray"
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-nc-sa/2.0/?ref=openverse"
          >
            CC BY-NC-SA 2.0
          </a>
        </p>
        <li className="open-li">Announce shady practices</li>
        <p className="open-p">
          If an app trys to secretly sell their users data and the code is open
          source, people will immediately notice an announce it to the public.
          For instance, Apple was just found tracking their users as soon as the
          phone is set up without telling the user. Even though they have to
          tell the user, nobody knew beacuse the code for their phone is not
          open source.
        </p>
        <li className="open-li">Use the code in their own app</li>
        <p className="open-p">
          This is pretty simple, if somebody wants a feature, they can use it.
          This makes the whole technology ecosystem a better place. Even small
          developers have the capability to make an app as good as a company
          like Google.
        </p>
        <li className="open-li">Suggest changes to the code</li>
        <p className="open-p">
          This is really helpfull especially if you are a solo dev and don't
          have a team to help fix unknown bugs. If somebody is esspecially good
          in one field, they can help another developer who is not doing it in
          the most efficient way
        </p>
        <li className="open-li">Make a "fork" of the app</li>
        <p className="open-p">
          This means there can be more competition which will drive the app to
          become better. For instance, if an app is missing some essential
          features that the public wants, somebody can copy the existing app,
          adding the needed features, then redestrubuite. Then if somebody
          really wants that feature, they can just use the fork instead of
          coding it themselves.
        </p>
      </ul>

      <h2 className="open-h2">Technology that is powered by open source</h2>
      <p className="open-p">
        Everything is build on top of open source software. Just think, if there
        was no open source software, anytime you wanted to code an application,
        you would have to build it from scratch; every developer reinventing the
        wheel over and over again.{" "}
      </p>
      <img
        id="img"
        src="https://live.staticflickr.com/4562/26763407419_6555dace70_w_d.jpg"
        alt="iphone"
      />
      <h3 className="open-h3">
        There are millions of devices that run software that is open source.
      </h3>
      <ul className="open-ul">
        <li className="open-li">Chrome</li>
        <li className="open-li">Android</li>
        <li className="open-li">Apache HTTP Server (The web)</li>
        <li className="open-li">Code.org</li>
        <li className="open-li">Linux</li>
        <li className="open-li">VLC</li>
      </ul>
      <h3 className="open-h3">And even more devices powered by open source</h3>
      <p className="open-p attribution" id="cite">
        "
        <a
          id="gray"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.flickr.com/photos/94977883@N08/26763407419"
        >
          iPhone X
        </a>
        " by{" "}
        <a
          id="gray"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.flickr.com/photos/94977883@N08"
        >
          TheBetterDay
        </a>{" "}
        is licensed under{" "}
        <a
          id="gray"
          target="_blank"
          rel="noopener noreferrer"
          href="https://creativecommons.org/licenses/by-nd/2.0/?ref=openverse"
        >
          CC BY-ND 2.0
        </a>{" "}
      </p>
      <ul className="open-ul">
        <li className="open-li">Google</li>
        <li className="open-li">iPhone</li>
        <li className="open-li">
          Programming languages (Java, python, Javascript etc.)
        </li>
        <li className="open-li">James webb telescope</li>

        <li className="open-li">Windows</li>
      </ul>
    </div>
  );
}
