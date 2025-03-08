'use client';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import React from 'react';

const steps = ['Passo 1', 'Passo 2', 'Passo 3'];

const HorizontalLinearStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="p-8 h-full w-full flex flex-col items-center justify-center">
      <Stepper
        activeStep={activeStep}
        className="w-full max-w-2xl mb-8"
        connector={<div className="border-t-2 border-gray-300" />} // Personaliza o conector
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconProps={{
                // Personaliza os ícones dos passos
                sx: {
                  color: index === activeStep ? '#3b82f6' : '#9ca3af', // Azul para o passo ativo, cinza para os inativos
                },
              }}
            >
              <span
                className={`text-lg font-semibold ${
                  index === activeStep ? 'text-primary-500' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg transition-all duration-500 ease-in-out transform">
        {activeStep === steps.length ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Todos os passos concluídos!
            </h1>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setActiveStep(0)}
              className="bg-primary-500 hover:bg-primary-600"
            >
              Reiniciar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {steps[activeStep]}
            </h1>
            <div className="flex justify-between">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Voltar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className="bg-primary-500 hover:bg-primary-600"
              >
                {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalLinearStepper;