import Button from '../elements/button'
import { useState } from 'react'
import { fetchAPI } from 'utils/api'
import * as yup from 'yup'
import { Formik } from 'formik'

const LeadForm = ({ data }) => {
  const [loading, setLoading] = useState(false)

  const schema = yup.object().shape({
    email: yup.string().email().required(),
  })

  return (
    <div className="py-10 text-center">
      <h1 className="text-3xl mb-10 font-bold mb-2">{data.title}</h1>
      <div className="flex flex-col items-center flex-wrap ">
        <Formik
          initialValues={{ email: '' }}
          validate={async (values) => {
            const valid = await schema.isValid({
              email: values.email,
            })

            const errors = {}

            if (!values.email) {
              errors.email = 'Email is required'
            }

            if (!valid) {
              errors.email = 'Please enter a valid email'
            }

            return errors
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            setLoading(true)

            try {
              setErrors({ api: null })
              await fetchAPI('/lead-form-submissions', {
                method: 'POST',
                body: JSON.stringify({
                  email: values.email,
                  location: data.location,
                }),
              })
            } catch (err) {
              setErrors({ api: err.message })
            }

            setLoading(false)
            setSubmitting(false)
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="flex gap-4">
                <input
                  className="text-base focus:outline-none px-4 border-2 rounded-md"
                  type="email"
                  name="email"
                  placeholder={data.emailPlaceholder}
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  button={data.submitButton}
                  disabled={isSubmitting}
                  loading={loading}
                  handleClick={handleSubmit}
                />
              </div>
              <p className="text-red-500 h-12 text-sm mt-1 ml-2 text-left">
                {(errors.email && touched.email && errors.email) || errors.api}
              </p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default LeadForm
