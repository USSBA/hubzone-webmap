# Helper methods for the application
module ApplicationHelper
  def date_to_string(date)
    I18n.l(Date.parse(date), format: :full)
  end
end
