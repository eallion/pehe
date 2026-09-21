# {{ .Title }}

- Date: {{ .Date | time.Format "2006-01-02" }}
- URL: {{ .Permalink }}
{{- with .Params.categories }}
- Categories: {{ delimit . ", " }}
{{- end }}
{{- with .Params.tags }}
- Tags: {{ delimit . ", " }}
{{- end }}

{{ .RawContent | chomp }}
