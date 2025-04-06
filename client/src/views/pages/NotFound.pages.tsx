import { JSX } from 'react';

function NotFoundPage(): JSX.Element {
  return (
    <section className="bg-white font-arvo py-10">
      <div className="container mx-auto">
        <div className="row">
          <div className="col-span-12">
            <div className="mx-auto col-span-10 text-center">
              <div className="bg-[url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')] h-[400px] bg-center bg-no-repeat">
                <h1 className="text-center text-[80px]">404</h1>
              </div>

              <div className="mt-[-50px]">
                <h3 className="h2 text-[80px]">
                  Look like you're lost
                </h3>
                <p>the page you are looking for not available!</p>
                <a href="/" className="inline-block text-white py-2 px-5 bg-green-500 mt-5 no-underline hover:bg-green-600 focus:ring focus:ring-green-300">
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;