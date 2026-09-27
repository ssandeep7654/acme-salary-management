class SalaryAnalyticsService
  EXCHANGE_RATES = Employee::USD_EXCHANGE_RATES

  def self.overview
    active_scope = Employee.active

    # Compute USD salary for active employees
    employees_data = active_scope.pluck(:currency, :current_salary, :gender)
    return empty_overview if employees_data.empty?

    usd_salaries = employees_data.map do |curr, sal, _gen|
      rate = EXCHANGE_RATES[curr] || 1.0
      (sal.to_f * rate).round(2)
    end.sort

    female_salaries = employees_data.select { |_, _, gen| gen == "Female" }.map do |curr, sal, _|
      (sal.to_f * (EXCHANGE_RATES[curr] || 1.0)).round(2)
    end.sort

    male_salaries = employees_data.select { |_, _, gen| gen == "Male" }.map do |curr, sal, _|
      (sal.to_f * (EXCHANGE_RATES[curr] || 1.0)).round(2)
    end.sort

    total_count = usd_salaries.size
    total_spend = usd_salaries.sum.round(2)
    avg_salary = (total_spend / total_count).round(2)
    median_salary = calculate_median(usd_salaries)

    female_median = calculate_median(female_salaries)
    male_median = calculate_median(male_salaries)

    pay_equity_ratio = male_median.zero? ? 100.0 : ((female_median / male_median) * 100).round(1)

    {
      total_employees: total_count,
      total_payroll_usd: total_spend,
      average_salary_usd: avg_salary,
      median_salary_usd: median_salary,
      min_salary_usd: usd_salaries.first || 0,
      max_salary_usd: usd_salaries.last || 0,
      female_median_usd: female_median,
      male_median_usd: male_median,
      gender_pay_equity_ratio: pay_equity_ratio
    }
  end

  def self.by_country
    employees = Employee.active.pluck(:country, :currency, :current_salary)
    grouped = employees.group_by { |country, _, _| country }

    grouped.map do |country, records|
      currency = records.first[1]
      rate = EXCHANGE_RATES[currency] || 1.0

      local_salaries = records.map { |_, _, sal| sal.to_f }.sort
      usd_salaries = local_salaries.map { |sal| (sal * rate).round(2) }.sort

      {
        country: country,
        currency: currency,
        employee_count: records.size,
        total_spend_local: local_salaries.sum.round(2),
        total_spend_usd: usd_salaries.sum.round(2),
        avg_salary_local: (local_salaries.sum / records.size).round(2),
        avg_salary_usd: (usd_salaries.sum / records.size).round(2),
        median_salary_usd: calculate_median(usd_salaries)
      }
    end.sort_by { |c| -c[:total_spend_usd] }
  end

  def self.by_department
    employees = Employee.active.pluck(:department, :currency, :current_salary)
    grouped = employees.group_by { |dept, _, _| dept }

    grouped.map do |dept, records|
      usd_salaries = records.map do |_, curr, sal|
        rate = EXCHANGE_RATES[curr] || 1.0
        (sal.to_f * rate).round(2)
      end.sort

      {
        department: dept,
        employee_count: records.size,
        total_spend_usd: usd_salaries.sum.round(2),
        avg_salary_usd: (usd_salaries.sum / records.size).round(2),
        median_salary_usd: calculate_median(usd_salaries),
        min_salary_usd: usd_salaries.first || 0,
        max_salary_usd: usd_salaries.last || 0
      }
    end.sort_by { |d| -d[:total_spend_usd] }
  end

  def self.gender_pay_equity
    employees = Employee.active.pluck(:department, :gender, :currency, :current_salary)
    
    # Department level breakdown
    dept_grouped = employees.group_by { |dept, _, _, _| dept }

    department_equity = dept_grouped.map do |dept, records|
      female_usd = records.select { |_, gen, _, _| gen == "Female" }.map { |_, _, curr, sal| (sal.to_f * (EXCHANGE_RATES[curr] || 1.0)).round(2) }.sort
      male_usd = records.select { |_, gen, _, _| gen == "Male" }.map { |_, _, curr, sal| (sal.to_f * (EXCHANGE_RATES[curr] || 1.0)).round(2) }.sort

      female_median = calculate_median(female_usd)
      male_median = calculate_median(male_usd)
      gap_pct = male_median.zero? ? 0.0 : (((male_median - female_median) / male_median) * 100).round(1)

      {
        department: dept,
        female_count: female_usd.size,
        female_avg_usd: female_usd.empty? ? 0 : (female_usd.sum / female_usd.size).round(2),
        female_median_usd: female_median,
        male_count: male_usd.size,
        male_avg_usd: male_usd.empty? ? 0 : (male_usd.sum / male_usd.size).round(2),
        male_median_usd: male_median,
        pay_gap_percentage: gap_pct
      }
    end.sort_by { |d| d[:pay_gap_percentage] }.reverse

    {
      overall: overview.slice(:female_median_usd, :male_median_usd, :gender_pay_equity_ratio),
      departments: department_equity
    }
  end

  def self.performance_vs_salary
    employees = Employee.active.pluck(:performance_rating, :currency, :current_salary)
    grouped = employees.group_by { |rating, _, _| rating || 3 }

    (1..5).map do |rating|
      records = grouped[rating] || []
      usd_salaries = records.map { |_, curr, sal| (sal.to_f * (EXCHANGE_RATES[curr] || 1.0)).round(2) }.sort

      {
        performance_rating: rating,
        employee_count: records.size,
        avg_salary_usd: usd_salaries.empty? ? 0 : (usd_salaries.sum / records.size).round(2),
        median_salary_usd: calculate_median(usd_salaries)
      }
    end
  end

  def self.insights
    dept_data = by_department
    country_data = by_country
    equity_data = gender_pay_equity
    perf_data = performance_vs_salary

    highest_dept = dept_data.max_by { |d| d[:median_salary_usd] }
    highest_country = country_data.max_by { |c| c[:avg_salary_usd] }
    highest_gap_dept = equity_data[:departments].max_by { |d| d[:pay_gap_percentage] }
    top_perf = perf_data.find { |p| p[:performance_rating] == 5 }
    low_perf = perf_data.find { |p| p[:performance_rating] == 1 }

    perf_premium = if low_perf && top_perf && !low_perf[:avg_salary_usd].zero?
      (((top_perf[:avg_salary_usd] - low_perf[:avg_salary_usd]) / low_perf[:avg_salary_usd]) * 100).round(1)
    else
      0.0
    end

    promotions_count = SalaryHistory.where(change_reason: "Promotion").distinct.count(:employee_id)
    total_emp = Employee.count
    promotion_rate = total_emp.zero? ? 0.0 : ((promotions_count.to_f / total_emp) * 100).round(1)

    [
      {
        id: "dept_highest_pay",
        question: "Which department has the highest median compensation?",
        answer: "#{highest_dept[:department]} leads the organization with a median salary of $#{format_num(highest_dept[:median_salary_usd])} USD across #{highest_dept[:employee_count]} employees.",
        metric: "$#{format_num(highest_dept[:median_salary_usd])} USD",
        category: "Department"
      },
      {
        id: "country_highest_pay",
        question: "Which country region commands the highest average compensation?",
        answer: "#{highest_country[:country]} has the highest average annual pay at $#{format_num(highest_country[:avg_salary_usd])} USD per employee.",
        metric: "$#{format_num(highest_country[:avg_salary_usd])} USD",
        category: "Geography"
      },
      {
        id: "gender_pay_gap",
        question: "What is the largest departmental gender pay gap?",
        answer: "#{highest_gap_dept[:department]} shows the largest gender pay gap at #{highest_gap_dept[:pay_gap_percentage]}% (Male median: $#{format_num(highest_gap_dept[:male_median_usd])} vs Female median: $#{format_num(highest_gap_dept[:female_median_usd])}).",
        metric: "#{highest_gap_dept[:pay_gap_percentage]}%",
        category: "Equity"
      },
      {
        id: "perf_impact",
        question: "How does performance rating affect employee compensation?",
        answer: "Top performers (Rating 5) earn an average of #{perf_premium}% more than Rating 1 employees ($#{format_num(top_perf[:avg_salary_usd])} vs $#{format_num(low_perf[:avg_salary_usd])}).",
        metric: "+#{perf_premium}% Premium",
        category: "Performance"
      },
      {
        id: "promotion_frequency",
        question: "What percentage of employees have received a promotion?",
        answer: "#{promotion_rate}% of all employees (#{promotions_count} employees) have registered promotion history records.",
        metric: "#{promotion_rate}% Promoted",
        category: "Career Growth"
      }
    ]
  end

  private

  def self.calculate_median(sorted_arr)
    return 0 if sorted_arr.empty?
    len = sorted_arr.size
    (len % 2 == 1) ? sorted_arr[len / 2] : ((sorted_arr[(len / 2) - 1] + sorted_arr[len / 2]) / 2.0).round(2)
  end

  def self.format_num(num)
    ActiveSupport::NumberHelper.number_to_delimited(num.to_i)
  end

  def self.empty_overview
    {
      total_employees: 0,
      total_payroll_usd: 0,
      average_salary_usd: 0,
      median_salary_usd: 0,
      min_salary_usd: 0,
      max_salary_usd: 0,
      female_median_usd: 0,
      male_median_usd: 0,
      gender_pay_equity_ratio: 100.0
    }
  end
end
