import React from "react";

const OtherStats = () => {
  return (
    <section
      id="about"
      className="pt-5 lg:pt-[50px] bg-appPrimary relative"
    >
      <section className="py-5 md:py-20 lg:py-10  bg-green dark:text-white text-black lg:relative">
        <div className="inner container">
          <div className="w-auto xl:grid lgl:grid-cols-2 gap-6 block">
            <div className="">
              <div className="lg:sticky lg:top-20">
                <p className="text-xl md:text-3xl font-semibold pr-10">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Vitae necessitatibus similique dolores numquam facilis
                  quaerat.
                </p>
                <p className="lg:mt-14 mt-7 lg:mb-10 mb-5 pr-10 lg:text-[18px]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Possimus voluptatibus distinctio perferendis! Eos odit fugiat
                  delectus, placeat nam officia quae adipisci quod
                  necessitatibus ut porro modi molestiae facilis autem
                  dignissimos? Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Possimus voluptatibus distinctio
                  perferendis! Eos odit fugiat delectus, placeat nam officia
                  quae adipisci quod necessitatibus ut porro modi molestiae
                  facilis autem dignissimos? Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Possimus voluptatibus distinctio
                  perferendis! Eos odit fugiat delectus, placeat nam officia
                  quae adipisci quod necessitatibus ut porro modi molestiae
                  facilis autem dignissimos?
                </p>
              </div>
            </div>
            <div className="lg:col-span-2 lg:col-start-5 mt-10 lg:mt-0">
              <ul className="text-center space-y-14">
                <li>
                  <figure>
                    <div className="trillion flex justify-center items-center bg-appBlue py-4 rounded-full m-auto">
                      <span className="text-3xl text-white font-medium">
                        $1
                      </span>
                    </div>
                    <figcaption className="mt-6 max-w-[325px] m-auto">
                      Libero mollitia aperiam alias architecto eveniet id facere
                    </figcaption>
                  </figure>
                </li>
                <li>
                  <figure>
                    <div className="w-[114px] h-[114px] flex justify-center items-center bg-appBlue rounded-full m-auto">
                      <span className="text-3xl text-white font-medium">
                        86%{" "}
                      </span>
                    </div>
                    <figcaption className="mt-6 max-w-[325px] m-auto">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </figcaption>
                  </figure>
                </li>

                <li>
                  <figure>
                    <div className="dev flex justify-center items-center bg-appBlue py-4 rounded-full m-auto">
                      <span className="text-3xl text-white font-medium">
                        10 - 15 ms
                      </span>
                    </div>
                    <figcaption className="mt-6 max-w-[325px] m-auto">
                      Time to develop and bring new therapeutics to market
                    </figcaption>
                  </figure>
                </li>

                <li>
                  <figure>
                    <div className="dev flex justify-center items-center bg-appBlue py-4  rounded-full m-auto">
                      <span className="text-3xl text-white font-medium">
                        $2.5
                      </span>
                    </div>
                    <figcaption className="mt-6 max-w-[325px] m-auto">
                      quidem nulla, iste laudantium
                    </figcaption>
                  </figure>
                </li>

                <li>
                  <figure>
                    <div className="w-[114px] h-[114px] flex justify-center items-center bg-appBlue  rounded-full m-auto">
                      <span className="text-3xl text-white font-medium">
                        90%+
                      </span>
                    </div>
                    <figcaption className="mt-6 max-w-[325px] m-auto">
                      saepe, culpa tenetur sed iusto optio corrupti sit!
                    </figcaption>
                  </figure>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="first-wave">
        <svg
          fill="#1d4ed8"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default OtherStats;
