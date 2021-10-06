import React from "react";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form as AntdForm, Button } from "antd";
import { useDispatch } from "react-redux";
import { requests } from "services/requests";

import FormElements from "components/FormElements";
import { setAuthTokens } from "services/actions";
import { useMutation } from "react-query";
import { showNotification } from "utils/showNotification";

const LoginForm = () => {
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    phone: yup.string().min(9).required("validation.required"),
    password: yup.string().trim().required("validation.required"),
  });

  const methods = useForm({
    defaultValues: {
      phone: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const [login, loginInfo] = useMutation(requests.auth.login, {
    onSuccess: ({ data }) => {
      dispatch(setAuthTokens(data));
      methods.reset({
        phone: "",
        password: "",
      });
    },
    onError: () => {
      showNotification("error", "Ошибка при входе");
    },
  });

  const onSubmit = ({ phone, ...rest }) => {
    login({ ...rest, phone_number: phone });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="login-form">
        <FormElements.Input name="phone" label="Логин" />
        <FormElements.Input name="password" label="Пароль" password />
        <AntdForm.Item>
          {/*<Checkbox style={{ visibility: "hidden" }}>Remember me</Checkbox>*/}
          {/*<Link to="/" className="login-form-forgot" style={{ visibility: "hidden" }}>*/}
          {/*    Forgot password*/}
          {/*</Link>*/}
          <Button
            type="primary"
            loading={loginInfo.isLoading}
            htmlType="submit"
            className="login-form-button"
          >
            Войти
          </Button>
        </AntdForm.Item>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
