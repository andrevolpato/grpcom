$(document).ready(
    function() {        

        $("#datepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: function(diaSelecionado) {
                programacao.busca(diaSelecionado);
            }
        });
    }
); 

var programacao = {
    btnver: function() {
        if ($("#datepicker").val()) {
            programacao.busca($("#datepicker").val());
        } else {
            $("#datepicker").trigger('select');
        }
    },

    busca: function(diaSelecionado) {
        $('#results').html('Aguarde...');

        var dia = diaSelecionado.substring(6, 10) + '-'
                        + diaSelecionado.substring(3,5) + '-'
                        + diaSelecionado.substring(0,2);
        
        $.ajax({
            url: 'http://localhost:8081/v1/programacao',
            data: {dia: dia},
            success: function(data, code) {                
                programacao.grade(data);
            },
            error: function(jqXHR, msg) {
                console.log('error: ' + msg);                
            },
            complete: function(jqXHR, msg) {
                if (jqXHR.status != 200) {
                    $('#results').html('Programação indisponível para esta data.');
                }
            }
        });
    },

    grade: function(data) {
        if ((!data) || (typeof data != 'object') ) {
            $('#results').html('Dados de programação não disponíveis.');
            return;
        }
        
        var tz = (new Date).getTimezoneOffset();
        var now = Math.floor( ( Date.now() / 1000) - (tz * 60) );
        var template = $('#template').html();
        var html = '';
        
        $.each(data.programme.entries, function(i, item) {
            let logo = item.custom_info.Graficos.LogoURL ?? 'https://s3.glbimg.com/v1/AUTH_947d0a0390ad47fbba7a4b93423e1004/Logo/76.jpg';
            let title = item.title;
            let desc = item.description;
            let itime = item.human_start_time.substring(0,5);
            let etime = item.human_end_time.substring(0,5);
            let card = template
                .replace('img src=""', 'img src="' + logo + '"')
                .replace('_TITLE_', title)
                .replace('_DESC_', desc)
                .replace('_ITIME_', itime)
                .replace('_ETIME_', etime);

            if (Number(item.start_time) <= now && Number(item.end_time) >= now) {
                card = card.replace('_VIVO_', 'AO VIVO AGORA');
            } else {
                card = card.replace('_VIVO_', '');
            }

            html = html + card;
        });
        $('#results').html(html);
    }
}