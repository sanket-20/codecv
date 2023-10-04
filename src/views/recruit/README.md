# Job Posting Guidelines

## Notice

warning:

info: If you need to add a new job posting, you can follow the format below in the recruit.ts file and then submit a PR or contact the author to add it.

> `warning`:  Job postings must be genuine and actively recruiting. Posting to inflate `KPI` will result in being added to the blacklist.

> `info`: f you need to add a new job posting, you can follow the format below in the `recruit.ts` file and then submit a `PR` or contact the author to add it.

- `logo`: Company logo (not mandatory, but if available, it can increase visibility)
- `type`: Target audience for recruitment
- `job`:  Job position being recruited for
- `corporation`: Recruiting company's name
- `tags`: Job or company-related tags
- `endTime`:  Application deadline
- `educational_required`: Educational requirements
- `remark`: Additional information
- `external_link`: Application process (you can provide an official link or provide WeChat contact information)

## Job Example

```js
{
    logo: 'https://gw.alicdn.com/imgextra/i3/O1CN0175GaEE1WFD2QbMmw2_!!6000000002758-2-tps-200-53.png',
    type: ['Fresh Graduates', '1-3 years of experience'],
    job: 'Frontend Development Engineer',
    corporation: 'Fliggy Travel',
    tags: ['Excellent Benefits', 'Simple Interview'],
    endTime: 'Apply as soon as possible',
    educational_required: ['Bachelor\'s Degree', 'Not mandatory 92', 'Exceptional cases considered'],
    remark: 'Great leadership, tried and tested by the author.',
    external_link: 'https://alibaba.com/feizhu'
}

```
