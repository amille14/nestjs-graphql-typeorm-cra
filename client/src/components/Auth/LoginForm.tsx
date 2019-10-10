import {
  ErrorMessage,
  Field,
  Form,
  Formik
  } from 'formik'
import React from 'react'
import { MeDocument, useLoginMutation } from '../../graphql/generated'

interface Props {}

interface LoginFormInputs {
  email: string
  password: string
}

const validateForm = ({ email, password }) => {
  let errors: Partial<LoginFormInputs> = {}
  if (!email) errors.email = 'Please enter your email'
  if (!password) errors.password = 'Please enter your password'
  return errors
}

const LoginForm: React.FC<Props> = () => {
  const [login] = useLoginMutation()

  const onSubmit = (values, { setSubmitting }) => {
    login({
      variables: values,
      update: (cache, { data }) => {
        const {
          login: { user, accessToken }
        } = data as any
        cache.writeData({ data: { accessToken } })
        cache.writeQuery({ query: MeDocument, data: { me: user } })
        setSubmitting(false)
      }
    }).catch(err => {
      console.error(err)
      setSubmitting(false)
    })
  }

  return (
    <div className="LoginForm">
      <h4>Log in</h4>
      <Formik
        initialValues={{ email: '', password: '' }}
        validate={validateForm}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="text" name="email" placeholder="joe@example.com" />
              <ErrorMessage className="ErrorMessage" name="email" component="div" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" placeholder="your password" />
              <ErrorMessage className="ErrorMessage" name="password" component="div" />
            </div>
            <button type="submit">{isSubmitting ? 'Submitting...' : 'Log in'}</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

LoginForm.defaultProps = {}

export default LoginForm
