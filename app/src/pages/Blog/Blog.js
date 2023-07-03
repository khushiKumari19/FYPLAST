import React from 'react';
import './Blog.css';
import { Container, Row, Col } from 'reactstrap';

const Blog = () => {
  return (
    <>
      <h1 className="blog">
        <strong>Driving the future of finance with CarT tokenized car investments</strong>
      </h1>

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="card">
                <div className="tools">
                  <div className="circle">
                    <span className="red box"></span>
                  </div>
                  <div className="circle">
                    <span className="yellow box"></span>
                  </div>
                  <div className="circle">
                    <span className="green box"></span>
                  </div>
                </div>
                <div className="card__content">
                  <h2>
                    <b>Build Your Passive Income with Cars on Blockchain</b>
                  </h2>
                  <p>
                    The car market, which has always been a sector known for being reluctant to innovate, continues in
                    constant technological evolution! Whether you're a car enthusiast or a savvy investor, the blockchain
                    revolution is opening up new opportunities to capitalize on the potential of the automotive industry.
                    Tokenization is the creation of digital assets that represent other assets, whether virtual or real.
                    They run on the blockchain and have been used to improve information security in various companies
                    and industries. And now, this movement has arrived in the car market!
                  </p>
                </div>
              </div>
              <br />
            </Col>

            <Col lg="6" md="6">
              <div className="card">
                <div className="tools">
                  <div className="circle">
                    <span className="red box"></span>
                  </div>
                  <div className="circle">
                    <span className="yellow box"></span>
                  </div>
                  <div className="circle">
                    <span className="green box"></span>
                  </div>
                </div>
                <div className="card__content">
                  <h2>
                    <b>Real World Assets on Blockchain</b>
                  </h2>
                  <p>
                    You may have heard of cryptocurrency and blockchain with speculative assets. This is not CarT's use;
                    for us, blockchain technology is the best solution to give investors ownership of real-world assets.
                    We use blockchain as a network to exchange financial assets, just as the internet is a network for
                    exchanging information. This new technology allows you to own your share of ownership without the
                    need for a broker. With the transaction cost very low, investors can buy multiple RealTokens and
                    receive rents from hundreds of properties at no cost.
                  </p>
                </div>
              </div>
              <br />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Blog;
