import React, { useState } from 'react';
import { connect } from 'react-redux';
import useCreatePost from './hooks/useCreatePost';
import { Steps, Button, message } from 'antd';
import FirstStep from './FirstStep/FirstStep';
import SecondStep from './SecondStep/SecondStep';
import ThirdStep from './ThirdStep/ThirdStep';
import FourthStep from './FourthStep/FourthStep';
import FifthStep from './FifthStep/FifthStep';
import SixthStep from './SixthStep/SixthStep';
import { addPostService, sendPaymentEmail  } from '../../Services/properties.service';

import 'antd/dist/antd.css';
import './step.css'

const { Step } = Steps;

const steps = [
  {
    title: 'Has elegido tu plan',
    content: <FirstStep />,
  },
  {
    title: 'Características',
    content: <SecondStep />,
  },
  {
    title: 'Ubicación',
    content: <ThirdStep />,
  },
  {
    title: 'Imágenes',
    content: <FourthStep />,
  },
  {
    title: 'Adicionales',
    content: <FifthStep />,
  },
  {
    title: 'Checkout',
    content: <SixthStep />,
  },
];

const ProgressBar = ({userInfo}) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const { postDetails } = useCreatePost();
  const dateObj = new Date();
  postDetails.premium ? dateObj.setDate(dateObj.getDate() + 90) : dateObj.setDate(dateObj.getDate() + 30)
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const expirationDate = day + "/" + month + "/" + year;
  const post = {
    name: userInfo.name,
    email: userInfo.email,
    title: postDetails.post_name,
    image: postDetails.images ? postDetails.images[0] : null,
    price: postDetails.price,
    plan: postDetails.premium ? "Premium" : "Basic",
    date: expirationDate,
  };
  return (
    <div className="ctn">
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Siguiente
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() =>{
            const resp = window.confirm(`¿Quieres crear la publicación ${postDetails.post_name}?`)
            if (resp) {
  
              addPostService(postDetails);
              message.success(
                `Tu publicación '${postDetails.post_name}' creada correctamente `
              );

              sendPaymentEmail(post);
            }
          }}>
            Listo
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Volver
          </Button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.session,
});

export default connect(mapStateToProps, null)(ProgressBar);